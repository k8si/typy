/// <reference path="../lib/node/node.d.ts" />
//This is to check commit.

import fs = require('fs');
import path = require('path');
import opcodes = require('./opcodes');
import utils = require('./utils');
import pyo = require('./py_objects');
import interp = require("./interpret");

/**
 * All of this was stolen directly from UnPyc (http://sourceforge.net/projects/unpyc/)
 * All I did was port Python (from UnPyc/Parse.py) -> Typescript
 */


/*
 TODO verify the little/big endian-ness of things
 TODO what is going on in Parser.read_type_long() ?

 */

export class Parser {

    private filename: string;
    private static pc: number;
    private static type_map = opcodes.TypeMap;
    private static PARSE_ERR: string = "parser error";

    constructor(filename:string, offset:number=8) {
        this.filename = filename;
    }

    // TODO would like to return a PyObject but can't figure out how to do that given async etc.
    public parse(offset:number): void {
        function callback(data, offset) {
            Parser.pc = 0;
            var pyObject = Parser.read_object(data.slice(offset, data.length));
//            console.log(typeof pyObject);
//            console.log(pyObject.toString());
//            pyObject.print_co_code();

            //now, disassemble the object's co_code
            var interpreter = new interp.Interpreter();
            interpreter.interpret(pyObject);
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

    /** TODO no idea what's going on here **/
    private static read_type_long(data:Buffer): number {
        var n = Parser.read_long(data);
        var sign = 1;
        if (n < 0){ sign = -1; n = -1*n;}
        console.assert(Parser.pc + 2 * n <= data.length, Parser.PARSE_ERR);
        var raw = '';
//    var l = 0L;
        var l = 0;
        for (var i = 0; i < n; i++) {
            var d = Parser.read_short(data);
            console.assert(d >= 0, Parser.PARSE_ERR);
            l += Math.pow(d * 32768, i);
            //raw += d.raw
        }
        return l * sign;
    }

    private static read_long(data:Buffer): number {
        if (Parser.pc + 4 > data.length) throw new Error("parsing error");
        var long = data.readInt32LE(Parser.pc);
        Parser.pc += 4;
        return long;
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
        var val: any;
        switch(byte) {

            case tm.NULL:
                return new pyo.PyNull(Parser.pc++);

            case tm.NONE:
                console.log("found none");
                return new pyo.PyNone(Parser.pc++);

            case tm.STOPITER:
                console.log("found stopiter");
                Parser.pc++;
                return undefined; //TODO

            case tm.ELLIPSIS:
                Parser.pc++;
                return undefined; // TODO

            case tm.FALSE:
                console.log("found false");
                return new pyo.PyFalse(Parser.pc++);

            case tm.TRUE:
                console.log("found true");
                return new pyo.PyTrue(Parser.pc++);

            case tm.INT:
                console.log("found int @ " + offset);
                return new pyo.PyInt(offset, Parser.read_long(data));

            case tm.INT64:
                console.log("found int64");
                return undefined; //TODO

            case tm.LONG:
                console.log("found long");
                return undefined;
//            return new pyo.PyLong(pc, read_type_long(data));

            case tm.FLOAT:
                console.log("found float");
                return new pyo.PyFloat(offset, Parser.read_float(data));

            case tm.BINARY_FLOAT:
                console.log("found binary_float");
                return undefined; //TODO

            case tm.COMPLEX: //TODO
                console.log("found complex");
                return undefined;

            case tm.BINARY_COMPLEX:
                console.log("found binary_complex");
                return undefined; //TODO

            case tm.INTERNED:
                console.log("found interned");
                return undefined; //TODO

            case tm.STRING:
                console.log("found string @ " + offset);
                return new pyo.PyString(offset, Parser.read_string(data));

            case tm.STRINGREF:
                console.log("found stringref");
                return undefined; //TODO

            case tm.UNICODE:
                return undefined; //TODO

            case tm.TUPLE:
                console.log("found tuple");
                return new pyo.PyTuple(offset, Parser.read_tuple(data));

            case tm.LIST:
                console.log("found list");
                return undefined; //TODO

            case tm.DICT:
                console.log("found dict");
                return undefined; //TODO

            case tm.FROZENSET:
                return undefined; //TODO

            case tm.CODE:
                console.log("found code @ " + offset);
                //based on http://daeken.com/2010-02-20_Python_Marshal_Format.html
                var argcount = Parser.read_long(data);
                var nlocals = Parser.read_long(data);
                var stacksize = Parser.read_long(data);
                var flags = Parser.read_long(data);
                var code = Parser.read_object(data);
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
                return obj;

            default:
                return undefined;
        }
    }
}





