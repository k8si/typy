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

    // TODO would like to return a PyObject but can't figure out how to do that given async etc.
    public parse(offset:number): void {

        function callback(data, offset) {
            Parser.pc = 0;
            var pyObject = Parser.read_object(data.slice(offset, data.length));
//            console.log(typeof pyObject);
//            console.log(pyObject.toString());
//            pyObject.print_co_code();

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

    /*
     def r_unsigned_long(self):
     if self.p + 4 > len(self.data): raise ParseErrorException(self.p)
     offset = self.p
     self.p += 4
     return pyLong(offset, long(struct.unpack('=L', self.data[self.p - 4 : self.p])[0]), self.data[self.p - 4 : self.p])
     */
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
//        console.log("found tuple of len " + n);
        console.assert(n >= 0, Parser.PARSE_ERR);
        var a = [];
        for (var i = 0; i < n; i++) {
            a.push(Parser.read_object(data));
        }
        return a;
    }

    //TODO this could probably be more succint
    private static read_object(data:Buffer): any {
        if (Parser.pc + 1 > data.length) throw new Error("parser error");
        var byte = data.readUInt8(Parser.pc); //read a char (1 byte)
        var offset = Parser.pc; //for bookkeeping
        Parser.pc++;
        var tm = this.type_map;
//        console.log("curr typechar: " + byte + " " + String.fromCharCode(byte));
//        var val: any;
        switch(byte) {

            case tm.NULL:
//                console.log("found null");
                return new pyo.PyNull(offset);

            case tm.NONE:
//                console.log("found none");
                return new pyo.PyNone(offset);

            case tm.STOPITER:
//                console.log("found stopiter");
                return new pyo.PyStopIter(offset);

            case tm.ELLIPSIS:
//                console.log("found ellipsis");
                return new pyo.PyEllipsis(offset);

            case tm.FALSE:
//                console.log("found false");
                return new pyo.PyFalse(offset);

            case tm.TRUE:
//                console.log("found true");
                return new pyo.PyTrue(offset);

            case tm.INT:
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
                var i = new pyo.PyLong(offset, Parser.read_long(data));
                var interned = Parser.internedStringList[i.value];
                return new pyo.PyStringRef(offset, interned);

            case tm.UNICODE:
                return undefined; //TODO

            case tm.TUPLE:
//                console.log("found tuple @ " + offset);
                return new pyo.PyTuple(offset, Parser.read_tuple(data));

            case tm.LIST:
//                console.log("found list");
                return undefined; //TODO

            case tm.DICT:
//                console.log("found dict");
                return undefined; //TODO

            case tm.FROZENSET:
                return undefined; //TODO

            case tm.CODE:
//                console.log("found code @ " + offset);
                //based on http://daeken.com/2010-02-20_Python_Marshal_Format.html
//                console.log("< read argcount, nlocals, stacksize, flags... >");
                var argcount = Parser.read_long(data);
                var nlocals = Parser.read_long(data);
                var stacksize = Parser.read_long(data);
                var flags = Parser.read_long(data);

                //PyString
                var code = Parser.read_object(data);


                //should be PyTuples
                var consts = Parser.read_object(data);
                var names = Parser.read_object(data);
                var varnames = Parser.read_object(data);
                var freevars = Parser.read_object(data);
                var cellvars = Parser.read_object(data);

                var filename = Parser.read_object(data);
                var name = Parser.read_object(data);

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

                return obj;

            default:
                return undefined;
        }
    }
}






