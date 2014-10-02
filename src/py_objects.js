/**
* Created by kate on 9/28/14.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/*
TODO this may all be unnecessarily complicated
TODO PyObjects for StopIter, Ellipsis, PyFloat, PyList, PySet and some others
TODO change "any"-type fields to something other than "any" (anything that's "any" is "any"
because I didn't feel like figuring it out at the time)
*/
var opcodes = require("./opcodes");

var APyObject = (function () {
    function APyObject() {
    }
    return APyObject;
})();
exports.APyObject = APyObject;

// abstract wrapper class for Python primitives / "simple types"
var APyPrimitive = (function (_super) {
    __extends(APyPrimitive, _super);
    function APyPrimitive(offset, type) {
        _super.call(this);
        this.offset = offset;
        this.type = type;
    }
    return APyPrimitive;
})(APyObject);
exports.APyPrimitive = APyPrimitive;

var PyNone = (function (_super) {
    __extends(PyNone, _super);
    function PyNone(offset) {
        _super.call(this, offset, "none");
        this.value = undefined;
    }
    return PyNone;
})(APyPrimitive);
exports.PyNone = PyNone;

var PyTrue = (function (_super) {
    __extends(PyTrue, _super);
    function PyTrue(offset) {
        _super.call(this, offset, "true");
        this.value = true;
    }
    return PyTrue;
})(APyPrimitive);
exports.PyTrue = PyTrue;

var PyFalse = (function (_super) {
    __extends(PyFalse, _super);
    function PyFalse(offset) {
        _super.call(this, offset, "false");
        this.value = false;
    }
    return PyFalse;
})(APyPrimitive);
exports.PyFalse = PyFalse;

// abstract wrapper class for Python "objects" / "complex types"
var APyComplex = (function (_super) {
    __extends(APyComplex, _super);
    function APyComplex(offset, type) {
        _super.call(this);
        this.offset = offset;
        this.type = type;
    }
    return APyComplex;
})(APyObject);
exports.APyComplex = APyComplex;

var PyInt = (function (_super) {
    __extends(PyInt, _super);
    function PyInt(offset, value) {
        _super.call(this, offset, "int");
        this.value = value;
    }
    return PyInt;
})(APyComplex);
exports.PyInt = PyInt;

var PyLong = (function (_super) {
    __extends(PyLong, _super);
    function PyLong(offset, value) {
        _super.call(this, offset, "long");
        this.value = value;
    }
    return PyLong;
})(APyComplex);
exports.PyLong = PyLong;

var PyString = (function (_super) {
    __extends(PyString, _super);
    function PyString(offset, value) {
        _super.call(this, offset, "string");
        this.value = value;
    }
    return PyString;
})(APyComplex);
exports.PyString = PyString;

var PyTuple = (function (_super) {
    __extends(PyTuple, _super);
    function PyTuple(offset, value) {
        _super.call(this, offset, "tuple");
        this.value = value;
    }
    return PyTuple;
})(APyComplex);
exports.PyTuple = PyTuple;

var PyCodeObject = (function (_super) {
    __extends(PyCodeObject, _super);
    function PyCodeObject(offset, argcount, nlocals, stacksize, flags, code, consts, names, varnames, freevars, cellvars, filename, name, firstlineno, lnotab) {
        _super.call(this, offset, "code_object");
        this.argcount = argcount;
        this.nlocals = nlocals;
        this.stacksize = stacksize;
        this.flags = flags;
        this.code = code;
        this.consts = consts;
        this.names = names;
        this.varnames = varnames;
        this.freevars = freevars;
        this.cellvars = cellvars;
        this.filename = filename;
        this.name = name;
        this.firstlineno = firstlineno;
        this.lnotab = lnotab;
    }
    PyCodeObject.prototype.toString = function () {
        var info = this.argcount + " " + this.nlocals + " " + this.stacksize + " " + this.flags;

        return "PyCodeObject: " + info;
    };

    PyCodeObject.prototype.print_co_code = function () {
        var buf = this.code.value;
        if (buf != undefined) {
            for (var i = 0; i < buf.length; i += 3) {
                console.log(buf[i].toString(16) + " -- " + opcodes.Opcode[buf[i]]);
                console.log(buf[i + 1]);
                console.log(buf[i + 2]);
            }
        } else {
            console.log("PyCodeObject's co_code is undefined.");
            throw new Error("this PyCodeObject's co_code is undefined");
        }
    };
    return PyCodeObject;
})(APyComplex);
exports.PyCodeObject = PyCodeObject;
