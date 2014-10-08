/// <reference path="../lib/node/node.d.ts" />

import fs = require('fs');
import path = require('path');
import opcodes = require('./opcodes');
import utils = require('./utils');
import pyo = require('./py_objects');

/**
 * All of this was stolen directly from UnPyc (http://sourceforge.net/projects/unpyc/)
 * All I did was port Python (from UnPyc/Parse.py) -> Typescript
 */


/*

 TODO verify the little/big endian-ness of things

 TODO we should take this stuff out of the global context (probably make them static methods of Parser?)
 the problem was, having "read_byte" as a method of Parser meant that I couldn't do the following:

 class Parser {
 ...
 fn(): string { return "foo"; }

 parse(): void {
 fs.readFile(file, function(err, data) {
 var s = this.fn(); ---> however, if I make fn() static, I can call Parser.fn() -- this seems weird but that's none of my business
 (also I guess one can't access class attributes (e.g. call "this.filename") from in here either?)
 }
 }
 }



 */

///** a global index into the pyc file we're reading (all of the read_ functions below incr this) **/
//var pc = 0;

//var PARSE_ERR: string = "parser error";
//var tm = opcodes.TypeMap;


class Parser {

    private filename: string;
    private static pc: number;
    private static type_map = opcodes.TypeMap;
    private static PARSE_ERR: string = "parser error";

    /**
     @param fname filename of *.pyc file to parse
     @param offset where in the file to start reading
     **/
    constructor(filename:string, offset:number=8) {
        this.filename = filename;
    }

    public parse(offset:number): void {
        function callback(data, offset) {
            Parser.pc = 0;
            var stuff = Parser.read_object(data.slice(offset, data.length));
            console.log(typeof stuff);
            console.log(stuff.toString());
            stuff.print_co_code();
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
//    var a = new Buffer(n);
        var a = [];
        for (var i = 0; i < n; i++) {
//        a[i] = read_object(data);
            a.push(Parser.read_object(data));
        }
        return a;
    }

    //TODO this could probably be more succint
    private static read_object(data:Buffer): any {
//    console.log("read_object @ offset: " + pc);
        if (Parser.pc + 1 > data.length) throw new Error("parser error");
        var byte = data.readUInt8(Parser.pc); //read a char (1 byte)
        var offset = Parser.pc; //for bookkeeping
        Parser.pc++;
//    var typechar = String.fromCharCode(byte);
        var tm = this.type_map;
        var val: any;
//    switch (typechar) {
        switch(byte) {

            case tm.NULL:
                return new pyo.PyNull(Parser.pc++);

            case tm.NONE:
//            pc++;
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
                return undefined; //TODO

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


//FIXME this may not work on Windows
var f = fs.realpathSync("../630-proj1/pyc/func.pyc");
var parser = new Parser(f);
parser.parse(8);



