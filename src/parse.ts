/// <reference path="../lib/node/node.d.ts" />
/// <reference path="../typings/long/long.d.ts" />
//This is to check commit.

import fs = require('fs');
import path = require('path');
import opcodes = require('./opcodes');
import utils = require('./utils');
import pyo = require('./py_objects');
import interp = require("./interpret");
import Long = require('long'); //https://github.com/borisyankov/DefinitelyTyped/blob/master/long/long.d.ts

/**
 * All of this was stolen directly from UnPyc (http://sourceforge.net/projects/unpyc/)
 * All I did was port Python (from UnPyc/Parse.py) -> Typescript
 */


/*
 TODO verify the little/big endian-ness of things
 TODO float vs long?
 */

export class Parser {

    private filename: string;
    private static pc: number;
    private static type_map = opcodes.TypeMap;
    private static PARSE_ERR: string = "parser error";
    private static internedStringList: Array<Buffer>;

    constructor(filename:string, offset:number=8) {
        this.filename = filename;
        Parser.internedStringList = new Array<Buffer>();
    }

    public parse(offset:number): void {
        function callback(data, offset) {
            Parser.pc = 0;
            console.log("\n< PARSING >");
            var pyObject = Parser.read_object(data.slice(offset, data.length));
            console.log("< /PARSING >\n");
            var vm = new interp.VirtualMachine();
            var result = vm.run_code(pyObject);
            console.log("FINALLY: result = " + result.toString());
//            pyObject.parse_code();
//            now, disassemble the object's co_code
//            var interpreter = new interp.Interpreter();
//            interpreter.interpret(pyObject);
        }
        fs.readFile(this.filename, function(err, data) {
            if (err) throw err;
            callback(data, offset);
        });
    }

    private static read_byte(data:Buffer): number {
        if (Parser.pc+1 > data.length) throw new Error(this.PARSE_ERR);
        return data.readUInt8(Parser.pc++);
    }

    private static read_short(data:Buffer): number {
        console.assert(Parser.pc + 2 <= data.length, Parser.PARSE_ERR);
        var short = data.readInt16LE(Parser.pc); //TODO verify this is actually analogous to "read_short"
        Parser.pc += 2;
        return short;
    }

    /**
     * read a 64 bit two's-complement integer value ??
     *
     * TODO no idea what's going on here i.e. whether or not this actually does the right thing
     * TODO should return type Long (or LongStatic?) but I get a compiler error
     * **/
    private static read_type_long(data:Buffer): any {
        console.assert(Parser.pc + 8 <= data.length, Parser.PARSE_ERR);
        var low32 = Parser.read_long(data);
        var high32 = Parser.read_long(data);
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

    private static read_long(data:Buffer): number {
        if (Parser.pc + 4 > data.length) throw new Error("parsing error");
        var long = data.readInt32LE(Parser.pc);
        Parser.pc += 4;
        return long;
    }

    private static read_unsigned_long(data:Buffer): number {
        if (Parser.pc + 4 > data.length) throw new Error(Parser.PARSE_ERR);
        var ulong = data.readUInt32LE(Parser.pc);
        Parser.pc += 4;
        return ulong;
    }

    private static read_float(data:Buffer): number {
        if (Parser.pc + 8 > data.length) throw new Error(Parser.PARSE_ERR);
        var float = data.readDoubleLE(Parser.pc);
        Parser.pc += 8;
        return float;
    }


    private static read_string(data:Buffer): Buffer {
        var coLength = Parser.read_long(data);
        var co_code = new Buffer(coLength);
        data.copy(co_code, 0, Parser.pc, Parser.pc+coLength);
        Parser.pc += coLength;
        return co_code;
    }

    private static read_tuple(data:Buffer): any[] {
        var n = Parser.read_long(data);
//        console.log("got tuple of len " + n + ": ");
        console.assert(n >= 0, Parser.PARSE_ERR);
        var a = [];
        for (var i = 0; i < n; i++) {
            var o = Parser.read_object(data);
            a.push(o);
//            a.push(Parser.read_object(data));
        }
//        for (var i = 0; i < n; i++) {
//            if (a[i]) console.log("\t" + a[i].toString());
//            else console.log("\t" + a[i]);
//        }
        return a;
    }

    /*
     def r_dict(self):
     offset = self.p
     d = {}
     k = self.r_object()
     while k.__class__.__name__ != 'pyNull':
     d[k] = self.r_object()
     k = self.r_object()
     return pyDict(offset, d[k)
     */
    //TODO fix/make sure this works
    private static read_dict(data:Buffer): utils.Dict<any> {
        console.log("read_dict...");
        var d = new utils.Dict<any>();
        var k = Parser.read_object(data);
        while (k != undefined && k != null) {
            var val = Parser.read_object(data);
            if (val != undefined && val != null && val.value != undefined && val.value != null) d.add(k, Parser.read_object(data));
            else break;
            k = val;
        }
        return d;
    }


    //TODO this could probably be more succint
    private static read_object(data:Buffer, extra?: string): any {
        if (Parser.pc + 1 > data.length) throw new Error("parser error");
        var byte = data.readUInt8(Parser.pc); //read a char (1 byte)
//        if (extra) console.log(extra + " : current typechar: " + String.fromCharCode(byte));
        var offset = Parser.pc; //for bookkeeping
        Parser.pc++;
        var tm = this.type_map;
        switch(byte) {

            case tm.NULL:
                return new pyo.PyNull(offset);

            case tm.NONE:
                return new pyo.PyNone(offset);

            case tm.STOPITER:
                return new pyo.PyStopIter(offset);

            case tm.ELLIPSIS:
                return new pyo.PyEllipsis(offset);

            case tm.FALSE:
                return new pyo.PyFalse(offset);

            case tm.TRUE:
                return new pyo.PyTrue(offset);

            case tm.INT: //TODO just return "number" instead ?
//                console.log("found int @ " + offset);
                return new pyo.PyInt(offset, Parser.read_long(data));

            //TODO not sure if this is correct
            case tm.INT64:
//                console.log("found int64");
                var lo4 = Parser.read_unsigned_long(data);
                var hi4 = Parser.read_long(data);
                return new pyo.PyInt64(offset, new Long(lo4, hi4));

            case tm.LONG:
//                console.log("found long");
                return new pyo.PyLong(offset, Parser.read_type_long(data));

            case tm.FLOAT:
//                console.log("found float");
                return new pyo.PyFloat(offset, Parser.read_float(data));

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
                var tmp = Parser.read_string(data);
                Parser.internedStringList.push(tmp);
                return new pyo.PyInterned(offset, tmp);

            case tm.STRING:
//                console.log("found string @ " + offset);
                return new pyo.PyString(offset, Parser.read_string(data));

            case tm.STRINGREF:
//                console.log("found stringref @ " + offset);
                var i = Parser.read_long(data); //new pyo.PyLong(offset, Parser.read_long(data));
                var interned = Parser.internedStringList[i];
                return new pyo.PyStringRef(offset, interned);

            case tm.UNICODE:
                var tmp = Parser.read_string(data);
                return new pyo.PyUnicode(offset, tmp.toString('utf8')); //TODO

            case tm.TUPLE:
//                console.log("found tuple @ " + offset);
                return new pyo.PyTuple(offset, Parser.read_tuple(data));

            case tm.LIST:
                console.log("found list");
                return new pyo.PyList(offset, Parser.read_tuple(data)); //TODO

            case tm.DICT:
                console.log("found dict @ " + offset);
                return new pyo.PyDict(offset, Parser.read_dict(data)); //TODO

            case tm.FROZENSET:
                return new pyo.PyFrozenSet(offset, Parser.read_tuple(data));
//                return undefined; //TODO

            case tm.CODE:
                //based on http://daeken.com/2010-02-20_Python_Marshal_Format.html
                var argcount = Parser.read_long(data);
                var nlocals = Parser.read_long(data);
                var stacksize = Parser.read_long(data);
                var flags = Parser.read_long(data);

                //PyString
//                console.log("code: " + String.fromCharCode(byte));
                var code = Parser.read_object(data, "code");

                //should be PyTuples
//                console.log("consts: " + String.fromCharCode(byte));
                var consts = Parser.read_object(data, "consts");
                var names = Parser.read_object(data, "names");
                var varnames = Parser.read_object(data, "varnames");
                var freevars = Parser.read_object(data, "freevars");
                var cellvars = Parser.read_object(data, "cellvars");

                var filename = Parser.read_object(data, "filename");
                var name = Parser.read_object(data, "name");

                var firstlineno = Parser.read_long(data);
                var lnotab = Parser.read_long(data);

                var obj = new pyo.PyCodeObject(offset, //offset
                    argcount, nlocals, stacksize, flags,
                    code, consts, names, varnames,
                    freevars, cellvars, filename, name,
                    firstlineno, lnotab
                );

                console.log(obj.toString());
                obj.print_co_code();
//                obj.parse_co_code();

                return obj;

            default:
                return undefined;
        }
    }
}






