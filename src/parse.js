/// <reference path="../lib/node/node.d.ts" />
var fs = require('fs');

var opcodes = require('./opcodes');

var pyo = require('./py_objects');

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

var PARSE_ERR = "parser error";
var tm = opcodes.type_map;

function print_co_code(buf) {
    for (var i = 0; i < buf.length; i += 3) {
        console.log(buf[i].toString(16) + " -- " + opcodes.Opcode[buf[i]]);
        console.log(buf[i + 1]);
        console.log(buf[i + 2]);
    }
}

function read_byte(data) {
    if (pc + 1 > data.length)
        throw new Error(PARSE_ERR);
    return data.readUInt8(pc++);
}

function read_short(data) {
    console.assert(pc + 2 <= data.length, PARSE_ERR);
    var short = data.readInt16LE(pc);
    pc += 2;
    return short;
}

function read_long(data) {
    if (pc + 4 > data.length)
        throw new Error("parsing error");
    var long = data.readInt32LE(pc);
    pc += 4;
    return long;
}

/** TODO no idea what's going on here **/
function read_type_long(data) {
    var n = read_long(data);
    var sign = 1;
    if (n < 0) {
        sign = -1;
        n = -1 * n;
    }
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

function read_tuple(data) {
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

function read_string(data) {
    // string representation of the bytecode
    var coStart = data.readUInt8(pc++);
    console.log("at offset: " + pc + " code (first byte): " + coStart + " / " + String.fromCharCode(coStart));
    console.assert(String.fromCharCode(coStart) == 's', "Invalid first byte of co_code: " + coStart + "(" + String.fromCharCode(coStart) + ").");

    //    var coLength = data.readInt32LE(pc); pc += 4;
    var coLength = read_long(data);
    console.log("co_code length: " + coLength);
    var co_code = new Buffer(coLength);
    data.copy(co_code, 0, pc, pc + coLength);
    pc += coLength;
    print_co_code(co_code);
    return co_code;
}

//TODO this could probably be more succint
function read_object(data) {
    if (pc + 1 > data.length)
        throw new Error("parser error");
    var byte = data.readUInt8(pc);
    var typechar = String.fromCharCode(byte);
    var val;
    switch (typechar) {
        case tm.NULL:
            pc++;
            return undefined;

        case tm.NONE:
            console.log("found none");
            return new pyo.PyNone(pc++);

        case tm.STOPITER:
            pc++;
            return undefined;

        case tm.ELLIPSIS:
            pc++;
            return undefined;

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
            return undefined;

        case tm.LONG:
            console.log("found long");
            return undefined;

        case tm.FLOAT:
            console.log("found float");
            return undefined;

        case tm.BINARY_FLOAT:
            return undefined;

        case tm.COMPLEX:
            return undefined;

        case tm.BINARY_COMPLEX:
            return undefined;

        case tm.INTERNED:
            console.log("found interned");
            return undefined;

        case tm.STRING:
            var tmp = pc;
            console.log("found string @ " + pc);
            val = read_string(data);
            return new pyo.PyString(tmp, val);

        case tm.STRINGREF:
            console.log("found stringref");
            return undefined;

        case tm.UNICODE:
            return undefined;

        case tm.TUPLE:
            console.log("found tuple");
            return new pyo.PyTuple(pc, read_tuple(data));

        case tm.LIST:
            console.log("found list");
            return undefined;

        case tm.DICT:
            console.log("found dict");
            return undefined;

        case tm.FROZENSET:
            return undefined;

        case tm.CODE:
            console.log("found code @ " + pc);
            var obj = new pyo.PyCodeObject(pc, read_long(data), read_long(data), read_long(data), read_long(data), read_object(data), read_object(data), read_object(data), read_object(data), read_object(data), read_object(data), read_object(data), read_object(data), read_long(data), read_object(data));
            return obj;

        default:
            return undefined;
    }
}

//TODO this is basically useless as-is...
var Parser = (function () {
    /**
    @param fname filename of *.pyc file to parse
    @param offset where in the file to start reading
    **/
    function Parser(filename, offset) {
        if (typeof offset === "undefined") { offset = 8; }
        this.filename = filename;
    }
    Parser.fn = function () {
        return "foo";
    };

    Parser.prototype.parse = function (offset) {
        function callback(data, offset) {
            pc = 0;
            var stuff = read_object(data.slice(offset, data.length));
            console.log(typeof stuff);
            console.log(stuff.toString());
        }

        fs.readFile(this.filename, function (err, data) {
            if (err)
                throw err;
            callback(data, offset);
        });
    };
    return Parser;
})();

//FIXME this may not work on Windows
var f = fs.realpathSync("../630-proj1/pyc/func.pyc");
var parser = new Parser(f);
parser.parse(8);
