/// <reference path="../lib/node/node.d.ts" />
//This is to check commit.
var fs = require('fs');

var opcodes = require('./opcodes');

var pyo = require('./py_objects');
var interp = require("./interpret");

/**
* All of this was stolen directly from UnPyc (http://sourceforge.net/projects/unpyc/)
* All I did was port Python (from UnPyc/Parse.py) -> Typescript
*/
/*
TODO verify the little/big endian-ness of things
TODO what is going on in Parser.read_type_long() ?
*/
var Parser = (function () {
    function Parser(filename, offset) {
        if (typeof offset === "undefined") { offset = 8; }
        this.filename = filename;
    }
    // TODO would like to return a PyObject but can't figure out how to do that given async etc.
    Parser.prototype.parse = function (offset) {
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

    Parser.read_float = function (data) {
        if (Parser.pc + 8 > data.length)
            throw new Error(Parser.PARSE_ERR);
        var float = data.readDoubleLE(Parser.pc);
        Parser.pc += 8;
        return float;
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
        var a = [];
        for (var i = 0; i < n; i++) {
            a.push(Parser.read_object(data));
        }
        return a;
    };

    //TODO this could probably be more succint
    Parser.read_object = function (data) {
        if (Parser.pc + 1 > data.length)
            throw new Error("parser error");
        var byte = data.readUInt8(Parser.pc);
        var offset = Parser.pc;
        Parser.pc++;
        var tm = this.type_map;
        var val;
        switch (byte) {
            case 79 /* NULL */:
                return new pyo.PyNull(Parser.pc++);

            case 78 /* NONE */:
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
                return new pyo.PyFloat(offset, Parser.read_float(data));

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
exports.Parser = Parser;
