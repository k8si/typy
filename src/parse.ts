/// <reference path="../lib/node/node.d.ts" />

import fs = require('fs');
import path = require('path');
import opcodes = require('./opcodes');
import utils = require('./utils');
import constants = require('./constants');
//import types = require('./types');
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

/** a global index into the pyc file we're reading (all of the read_ functions below incr this) **/
var pc = 0;

var PARSE_ERR: string = "parser error";
var tm = opcodes.type_map;

function print_co_code(buf:Buffer) {
    for (var i = 0; i < buf.length; i+=3){
        console.log(buf[i].toString(16) + " -- " + opcodes.Opcode[buf[i]]);
        console.log(buf[i+1]);
        console.log(buf[i+2]);
    }
}

function read_byte(data:Buffer): number { if (pc+1 > data.length) throw new Error(PARSE_ERR); return data.readUInt8(pc++); }

function read_short(data:Buffer): number {
    console.assert(pc + 2 <= data.length, PARSE_ERR);
    var short = data.readInt16LE(pc); //TODO verify this is actually analogous to "read_short"
    pc += 2;
    return short;
}

function read_long(data:Buffer): number {
    if (pc + 4 > data.length) throw new Error("parsing error");
    var long = data.readInt32LE(pc);
    pc += 4;
    return long;
}

/** TODO no idea what's going on here **/
function read_type_long(data:Buffer): number {
    var n = read_long(data);
    var sign = 1;
    if (n < 0){ sign = -1; n = -1*n;}
    console.assert(pc + 2 * n <= data.length, PARSE_ERR);
    var raw = '';
//    var l = 0L;
    var l = 0;
    for (var i = 0; i < n; i++) {
        var d = read_short(data);
        console.assert(d >= 0, PARSE_ERR);
        l += Math.pow(d * 32768, i);
        //raw += d.raw
    }
    return l * sign;
}

function read_tuple(data:Buffer): any[] {
    var n = read_long(data);
    console.assert(n >= 0, PARSE_ERR);
//    var a = new Buffer(n);
    var a = [];
    for (var i = 0; i < n; i++) {
//        a[i] = read_object(data);
        a.push(read_object(data));
    }
    return a;
}

function read_string(data:Buffer): Buffer {
    // string representation of the bytecode
    var coStart = data.readUInt8(pc++);
    console.log("at offset: " + pc + " code (first byte): " + coStart + " / " + String.fromCharCode(coStart));
    console.assert(String.fromCharCode(coStart) == 's', "Invalid first byte of co_code: " + coStart + "(" + String.fromCharCode(coStart) + ").");
//    var coLength = data.readInt32LE(pc); pc += 4;
    var coLength = read_long(data);
    console.log("co_code length: " + coLength);
    var co_code = new Buffer(coLength);
    data.copy(co_code, 0, pc, pc+coLength);
    pc += coLength;
    print_co_code(co_code);
    return co_code;
}

function read_object(data:Buffer): any {
    if (pc + 1 > data.length) throw new Error("parser error");
    var byte = data.readUInt8(pc);
    var typechar = String.fromCharCode(byte);
    var val: any;
    switch (typechar) {

        case tm.NULL:
            pc++;
            return undefined; //TODO

        case tm.NONE:
            console.log("found none");
            return new pyo.PyNone(pc++);

        case tm.STOPITER:
            pc++;
            return undefined; //TODO

        case tm.ELLIPSIS:
            pc++;
            return undefined; // TODO

        case tm.FALSE:
            console.log("found false");
            return new pyo.PyFalse(pc++);

        case tm.TRUE:
            console.log("found true");
            return new pyo.PyTrue(pc++);

        case tm.INT:
            console.log("found int @ " + pc);
            return new pyo.PyInt(pc, read_long(data));

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
            return undefined; //TODO

        case tm.COMPLEX: //TODO
            return undefined;

        case tm.BINARY_COMPLEX:
            return undefined; //TODO

        case tm.INTERNED:
            console.log("found interned");
            return undefined; //TODO

        case tm.STRING:
            var tmp = pc;
            console.log("found string @ " + pc);
            val = read_string(data);
            return new pyo.PyString(tmp, val);

        case tm.STRINGREF:
            console.log("found stringref");
            return undefined; //TODO

        case tm.UNICODE:
            return undefined; //TODO

        case tm.TUPLE:
            console.log("found tuple");
            return new pyo.PyTuple(pc, read_tuple(data));

        case tm.LIST:
            console.log("found list");
            return undefined; //TODO

        case tm.DICT:
            console.log("found dict");
            return undefined; //TODO

        case tm.FROZENSET:
            return undefined; //TODO

        case tm.CODE:
            console.log("found code @ " + pc);
            var obj = new pyo.PyCodeObject(pc, //offset
                read_long(data), read_long(data), read_long(data), read_long(data), //argcount, nlocals, stacksize, flags
                read_object(data), read_object(data), read_object(data), read_object(data), //code, consts, names, varnames
                read_object(data), read_object(data), read_object(data), read_object(data), //freevars, cellvars, filename, name
                read_long(data), read_object(data) //firstlineno, lnotab
            );
            return obj;

        default:
            return undefined;
    }
}

//TODO this is basically useless as-is...
class Parser {
    private filename: string;
    private co: any;
    private data: Buffer;
    private marshalTypes = constants.marshalTypes;

    /**
     @param fname filename of *.pyc file to parse
     @param offset where in the file to start reading
     **/
    constructor(filename:string, offset:number=8) {
        this.filename = filename;
    }

    public static fn(): string { return "foo" }

    parse(offset:number){

        function callback(data, offset) {
            pc = 0;
            var stuff = read_object(data.slice(offset, data.length));
            console.log(typeof stuff);
            console.log(stuff.toString());
        }

        fs.readFile(this.filename, function(err, data) {
            if (err) throw err;
            callback(data, offset);
        });
    }
}


//FIXME this may not work on Windows
var f = fs.realpathSync("../630-proj1/pyc/func.pyc");
var parser = new Parser(f);
parser.parse(8);
