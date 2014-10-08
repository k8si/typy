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
///** a global index into the pyc file we're reading (all of the read_ functions below incr this) **/
//var pc = 0;
//var PARSE_ERR: string = "parser error";
//var tm = opcodes.TypeMap;
var Parser = (function () {
    /**
    @param fname filename of *.pyc file to parse
    @param offset where in the file to start reading
    **/
    function Parser(filename, offset) {
        if (typeof offset === "undefined") { offset = 8; }
        this.filename = filename;
    }
    Parser.prototype.parse = function (offset) {
        function callback(data, offset) {
            Parser.pc = 0;
            var stuff = Parser.read_object(data.slice(offset, data.length));
            console.log(typeof stuff);
            console.log(stuff.toString());
            stuff.print_co_code();
        }
        fs.readFile(this.filename, function (err, data) {
            if (err)
                throw err;
            callback(data, offset);
        });
    };

    Parser.read_byte = function (data) {
        if (Parser.pc + 1 > data.length)
            throw new Error(this.PARSE_ERR);
        return data.readUInt8(Parser.pc++);
    };

    Parser.read_short = function (data) {
        console.assert(Parser.pc + 2 <= data.length, Parser.PARSE_ERR);
        var short = data.readInt16LE(Parser.pc);
        Parser.pc += 2;
        return short;
    };

    /** TODO no idea what's going on here **/
    Parser.read_type_long = function (data) {
        var n = Parser.read_long(data);
        var sign = 1;
        if (n < 0) {
            sign = -1;
            n = -1 * n;
        }
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
    };

    Parser.read_long = function (data) {
        if (Parser.pc + 4 > data.length)
            throw new Error("parsing error");
        var long = data.readInt32LE(Parser.pc);
        Parser.pc += 4;
        return long;
    };

    Parser.read_string = function (data) {
        var coLength = Parser.read_long(data);
        var co_code = new Buffer(coLength);
        data.copy(co_code, 0, Parser.pc, Parser.pc + coLength);
        Parser.pc += coLength;
        return co_code;
    };

    Parser.read_tuple = function (data) {
        var n = Parser.read_long(data);
        console.assert(n >= 0, Parser.PARSE_ERR);

        //    var a = new Buffer(n);
        var a = [];
        for (var i = 0; i < n; i++) {
            //        a[i] = read_object(data);
            a.push(Parser.read_object(data));
        }
        return a;
    };

    //TODO this could probably be more succint
    Parser.read_object = function (data) {
        //    console.log("read_object @ offset: " + pc);
        if (Parser.pc + 1 > data.length)
            throw new Error("parser error");
        var byte = data.readUInt8(Parser.pc);
        var offset = Parser.pc;
        Parser.pc++;

        //    var typechar = String.fromCharCode(byte);
        var tm = this.type_map;
        var val;

        switch (byte) {
            case 79 /* NULL */:
                return new pyo.PyNull(Parser.pc++);

            case 78 /* NONE */:
                //            pc++;
                console.log("found none");
                return new pyo.PyNone(Parser.pc++);

            case 83 /* STOPITER */:
                console.log("found stopiter");
                Parser.pc++;
                return undefined;

            case 46 /* ELLIPSIS */:
                Parser.pc++;
                return undefined;

            case 70 /* FALSE */:
                console.log("found false");
                return new pyo.PyFalse(Parser.pc++);

            case 84 /* TRUE */:
                console.log("found true");
                return new pyo.PyTrue(Parser.pc++);

            case 105 /* INT */:
                console.log("found int @ " + offset);
                return new pyo.PyInt(offset, Parser.read_long(data));

            case 73 /* INT64 */:
                console.log("found int64");
                return undefined;

            case 108 /* LONG */:
                console.log("found long");
                return undefined;

            case 102 /* FLOAT */:
                console.log("found float");
                return undefined;

            case 103 /* BINARY_FLOAT */:
                console.log("found binary_float");
                return undefined;

            case 120 /* COMPLEX */:
                console.log("found complex");
                return undefined;

            case 121 /* BINARY_COMPLEX */:
                console.log("found binary_complex");
                return undefined;

            case 116 /* INTERNED */:
                console.log("found interned");
                return undefined;

            case 115 /* STRING */:
                console.log("found string @ " + offset);
                return new pyo.PyString(offset, Parser.read_string(data));

            case 82 /* STRINGREF */:
                console.log("found stringref");
                return undefined;

            case 117 /* UNICODE */:
                return undefined;

            case 40 /* TUPLE */:
                console.log("found tuple");
                return new pyo.PyTuple(offset, Parser.read_tuple(data));

            case 91 /* LIST */:
                console.log("found list");
                return undefined;

            case 123 /* DICT */:
                console.log("found dict");
                return undefined;

            case 62 /* FROZENSET */:
                return undefined;

            case 99 /* CODE */:
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

                var obj = new pyo.PyCodeObject(offset, argcount, nlocals, stacksize, flags, code, consts, names, varnames, freevars, cellvars, filename, name, firstlineno, lnotab);
                return obj;

            default:
                return undefined;
        }
    };
    Parser.type_map = opcodes.TypeMap;
    Parser.PARSE_ERR = "parser error";
    return Parser;
})();

//FIXME this may not work on Windows
var f = fs.realpathSync("../630-proj1/pyc/func.pyc");
var parser = new Parser(f);
parser.parse(8);
