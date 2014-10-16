/// <reference path="../lib/node/node.d.ts" />
/// <reference path="../typings/long/long.d.ts" />

import fs = require('fs');
import path = require('path');
import opcodes = require('./opcodes');
import utils = require('./utils');
import pyo = require('./py_objects');
import interp = require("./interpret");
import Long = require('long'); //https://github.com/borisyankov/DefinitelyTyped/blob/master/long/long.d.ts

/**
 * All of this was stolen from UnPyc (http://sourceforge.net/projects/unpyc/)
 * All I did was port Python (from UnPyc/Parse.py) -> Typescript
 */


/*
 TODO verify the little/big endian-ness of things
 TODO float vs long?
 */

export class Parser {

    private filename: string;
    private pc: number;
    private type_map = opcodes.TypeMap;
    private PARSE_ERR: string = "parser error";
    private internedStringList: Array<Buffer>;

    constructor(filename:string, offset:number=8) {
        this.filename = filename;
        this.internedStringList = new Array<Buffer>();
    }

    public parse(bstring:string, offset:number): void {

        this.pc = 0;
        console.log("\nparsing...");
        var buf = new Buffer(bstring.slice(offset, bstring.length));
        var pyObject = this.read_object(buf);
        console.log("done. starting interpreter...");
        var vm = new interp.VirtualMachine();
        var result = vm.run_code(pyObject);
        console.log("finished.");
    }

    private read_byte(data:Buffer): number {
        if (this.pc+1 > data.length) throw new Error(this.PARSE_ERR);
        return data.readUInt8(this.pc++);
    }

//    private static read_short(data:Buffer): number {
//        console.assert(Parser.pc + 2 <= data.length, Parser.PARSE_ERR);
//        var short = data.readInt16LE(Parser.pc); //TODO verify this is actually analogous to "read_short"
//        Parser.pc += 2;
//        return short;
//    }
//
//    /**
//     * read a 64 bit two's-complement integer value ??
//     *
//     * TODO no idea what's going on here i.e. whether or not this actually does the right thing
//     * TODO should return type Long (or LongStatic?) but I get a compiler error
//     * **/
    private read_type_long(data:Buffer): dcodeIO.Long {
        console.assert(this.pc + 8 <= data.length, this.PARSE_ERR);
        var low32 = this.read_long(data);
        var high32 = this.read_long(data);
        return new Long(low32, high32);
//        var n = Parser.read_long(data);
//        var sign = 1;
//        if (n < 0){ sign = -1; n = -1*n;}
//        console.assert(Parser.pc + 2 * n <= data.length, Parser.PARSE_ERR);
//        var raw = '';
////    var l = 0L;
//        var l = 0;
//        for (var i = 0; i < n; i++) {
//            var d = Parser.read_short(data);
//            console.assert(d >= 0, Parser.PARSE_ERR);
//            l += Math.pow(d * 32768, i);
//            //raw += d.raw
//        }
//        return l * sign;
    }
//
    private read_long(data:Buffer): number {
        if (this.pc + 4 > data.length) throw new Error("parsing error");
        var long = data.readInt32LE(this.pc);
        this.pc += 4;
        return long;
    }

    private read_unsigned_long(data:Buffer): number {
        if (this.pc + 4 > data.length) throw new Error(this.PARSE_ERR);
        var ulong = data.readUInt32LE(this.pc);
        this.pc += 4;
        return ulong;
    }
//
    private read_float(data:Buffer): number {
        if (this.pc + 8 > data.length) throw new Error(this.PARSE_ERR);
        var float = data.readDoubleLE(this.pc);
        this.pc += 8;
        return float;
    }
//
//
    private read_string(data:Buffer): Buffer {
        var coLength = this.read_long(data);
        var co_code = new Buffer(coLength);
        data.copy(co_code, 0, this.pc, this.pc+coLength);
        this.pc += coLength;
        return co_code;
    }
//
    private read_tuple(data:Buffer): any[] {
        var n = this.read_long(data);
//        console.log("got tuple of len " + n + ": ");
        console.assert(n >= 0, this.PARSE_ERR);
        var a = [];
        for (var i = 0; i < n; i++) {
            var o = this.read_object(data);
            a.push(o);
//            a.push(Parser.read_object(data));
        }
//        for (var i = 0; i < n; i++) {
//            if (a[i]) console.log("\t" + a[i].toString());
//            else console.log("\t" + a[i]);
//        }
        return a;
    }
//
//    /*
//     def r_dict(self):
//     offset = self.p
//     d = {}
//     k = self.r_object()
//     while k.__class__.__name__ != 'pyNull':
//     d[k] = self.r_object()
//     k = self.r_object()
//     return pyDict(offset, d[k)
//     */
//    //TODO fix/make sure this works
    private read_dict(data:Buffer): utils.Dict<any> {
        console.log("read_dict...");
        var d = new utils.Dict<any>();
        var k = this.read_object(data);
        while (k != undefined && k != null) {
            var val = this.read_object(data);
            if (val != undefined && val != null && val.value != undefined && val.value != null) d.add(k, this.read_object(data));
            else break;
            k = val;
        }
        return d;
    }


    //TODO this could probably be more succint
    private read_object(data:Buffer, extra?: string): any {
        if (this.pc + 1 > data.length) throw new Error("parser error");
        console.log(typeof data);
//        var byte = 0;
        var byte = data.readUInt8(this.pc); //read a char (1 byte)
//        if (extra) console.log(extra + " : current typechar: " + String.fromCharCode(byte));
        var offset = this.pc; //for bookkeeping
        this.pc++;
        var tm = this.type_map;
        switch(byte) {

            case tm.NULL:
                return new pyo.PyNull();

            case tm.NONE:
                return new pyo.PyNone();

            case tm.STOPITER:
                return new pyo.PyStopIter();

            case tm.ELLIPSIS:
                return new pyo.PyEllipsis();

            case tm.FALSE:
                return new pyo.PyFalse();

            case tm.TRUE:
                return new pyo.PyTrue();

            case tm.INT: //TODO just return "number" instead ?
//                console.log("found int @ " + offset);
                return new pyo.PyInt(this.read_long(data));

            //TODO not sure if this is correct
            case tm.INT64:
//                console.log("found int64");
                var lo4 = this.read_unsigned_long(data);
                var hi4 = this.read_long(data);
                return new pyo.PyInt64(new Long(lo4, hi4));

            case tm.LONG:
//                console.log("found long");
                return new pyo.PyLong(this.read_type_long(data));

            case tm.FLOAT:
//                console.log("found float");
                return new pyo.PyFloat(this.read_float(data));

            case tm.BINARY_FLOAT:
//                console.log("found binary_float");
                return undefined; //TODO

            case tm.COMPLEX: //TODO
//                console.log("found complex");
                return undefined;

            case tm.BINARY_COMPLEX:
//                console.log("found binary_complex");
                return undefined; //TODO

            case tm.INTERNED:
//                console.log("found interned @ " + offset);
                var tmp = this.read_string(data);
                this.internedStringList.push(tmp);
                return new pyo.PyInterned(tmp);

            case tm.STRING:
//                console.log("found string @ " + offset);
                return new pyo.PyString(this.read_string(data));

            case tm.STRINGREF:
//                console.log("found stringref @ " + offset);
                var i = this.read_long(data); //new pyo.PyLong(offset, Parser.read_long(data));
                var interned = this.internedStringList[i];
                return new pyo.PyStringRef(interned);

            case tm.UNICODE:
                var tmp = this.read_string(data);
                return new pyo.PyUnicode(tmp.toString('utf8')); //TODO

            case tm.TUPLE:
//                console.log("found tuple @ " + offset);
                return new pyo.PyTuple(this.read_tuple(data));

            case tm.LIST:
                console.log("!!!! found list");
                return undefined;
//                return new pyo.PyList(offset, this.read_tuple(data)); //TODO

            case tm.DICT:
                console.log("!!!! found dict @ " + offset);
                return undefined;
//                return new pyo.PyDict(offset, this.read_dict(data)); //TODO

            case tm.FROZENSET:
                console.log("!!!! found frozenset @ " + offset);
                return undefined;
//                return new pyo.PyFrozenSet(offset, this.read_tuple(data));
//                return undefined; //TODO

            case tm.CODE:
                //based on http://daeken.com/2010-02-20_Python_Marshal_Format.html
                var argcount = this.read_long(data);
                var nlocals = this.read_long(data);
                var stacksize = this.read_long(data);
                var flags = this.read_long(data);

                //PyString
//                console.log("code: " + String.fromCharCode(byte));
                var code = this.read_object(data, "code");

                //should be PyTuples
//                console.log("consts: " + String.fromCharCode(byte));
                var consts = this.read_object(data, "consts");
                var names = this.read_object(data, "names");
                var varnames = this.read_object(data, "varnames");
                var freevars = this.read_object(data, "freevars");
                var cellvars = this.read_object(data, "cellvars");

                var filename = this.read_object(data, "filename");
                var name = this.read_object(data, "name");

                var firstlineno = this.read_long(data);
                var lnotab = this.read_long(data);

                var obj = new pyo.PyCodeObject(offset, //offset
                    argcount, nlocals, stacksize, flags,
                    code, consts, names, varnames,
                    freevars, cellvars, filename, name,
                    firstlineno, lnotab
                );

                console.log(obj.toString());
//                obj.print_co_code();
//                obj.parse_co_code();

                return obj;

            default:
                console.log('unknown type');
                return undefined;
        }
    }
}






