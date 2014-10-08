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
/*
TODO:
PyUnicode
PyInt64
PyComplex (complex number)
PyInterned
PyStringRef
PySet
*/
var opcodes = require("./opcodes");

var PyObject = (function () {
    function PyObject() {
    }
    return PyObject;
})();
exports.PyObject = PyObject;

// abstract wrapper class "simple" Python types which contain no data
var PyPrimitive = (function (_super) {
    __extends(PyPrimitive, _super);
    function PyPrimitive(offset, type) {
        _super.call(this);
        this.offset = offset;
        this.type = type;
    }
    return PyPrimitive;
})(PyObject);
exports.PyPrimitive = PyPrimitive;

var PyNull = (function (_super) {
    __extends(PyNull, _super);
    function PyNull(offset) {
        _super.call(this, offset, "null");
        this.value = undefined;
    }
    return PyNull;
})(PyPrimitive);
exports.PyNull = PyNull;

var PyNone = (function (_super) {
    __extends(PyNone, _super);
    function PyNone(offset) {
        _super.call(this, offset, "none");
        this.value = undefined;
    }
    return PyNone;
})(PyPrimitive);
exports.PyNone = PyNone;

var PyTrue = (function (_super) {
    __extends(PyTrue, _super);
    function PyTrue(offset) {
        _super.call(this, offset, "true");
        this.value = true;
    }
    return PyTrue;
})(PyPrimitive);
exports.PyTrue = PyTrue;

var PyFalse = (function (_super) {
    __extends(PyFalse, _super);
    function PyFalse(offset) {
        _super.call(this, offset, "false");
        this.value = false;
    }
    return PyFalse;
})(PyPrimitive);
exports.PyFalse = PyFalse;

// abstract wrapper class for "complex" Python types which contain data
var PyComplex = (function (_super) {
    __extends(PyComplex, _super);
    function PyComplex(offset, type) {
        _super.call(this);
        this.offset = offset;
        this.type = type;
    }
    return PyComplex;
})(PyObject);
exports.PyComplex = PyComplex;

var PyInt = (function (_super) {
    __extends(PyInt, _super);
    function PyInt(offset, value) {
        _super.call(this, offset, "int");
        this.value = value;
    }
    return PyInt;
})(PyComplex);
exports.PyInt = PyInt;

var PyLong = (function (_super) {
    __extends(PyLong, _super);
    function PyLong(offset, value) {
        _super.call(this, offset, "long");
        this.value = value;
    }
    return PyLong;
})(PyComplex);
exports.PyLong = PyLong;

var PyFloat = (function (_super) {
    __extends(PyFloat, _super);
    function PyFloat(offset, value) {
        _super.call(this, offset, "float");
        this.value = value;
    }
    return PyFloat;
})(PyComplex);
exports.PyFloat = PyFloat;

var PyString = (function (_super) {
    __extends(PyString, _super);
    function PyString(offset, value) {
        _super.call(this, offset, "string");
        this.value = value;
    }
    return PyString;
})(PyComplex);
exports.PyString = PyString;

var PyTuple = (function (_super) {
    __extends(PyTuple, _super);
    function PyTuple(offset, value) {
        _super.call(this, offset, "tuple");
        this.value = value;
    }
    return PyTuple;
})(PyComplex);
exports.PyTuple = PyTuple;

var PyList = (function (_super) {
    __extends(PyList, _super);
    function PyList(offset, value) {
        _super.call(this, offset, "list");
        this.value = value;
    }
    return PyList;
})(PyComplex);
exports.PyList = PyList;

var PyDict = (function (_super) {
    __extends(PyDict, _super);
    function PyDict(offset, value) {
        _super.call(this, offset, "dict");
        this.value = value;
    }
    return PyDict;
})(PyComplex);
exports.PyDict = PyDict;

var PyFrozenSet = (function (_super) {
    __extends(PyFrozenSet, _super);
    function PyFrozenSet(offset, value) {
        _super.call(this, offset, "set");
        this.value = value;
    }
    return PyFrozenSet;
})(PyComplex);
exports.PyFrozenSet = PyFrozenSet;

var PyCodeObject = (function (_super) {
    __extends(PyCodeObject, _super);
    function PyCodeObject(offset, argcount, nlocals, stacksize, flags, code, consts, names, varnames, freevars, cellvars, filename, name, firstlineno, lnotab) {
        _super.call(this, offset, "code_object");
        this.argcount = argcount;
        this.nlocals = nlocals;
        this.stacksize = stacksize;
        this.flags = flags;
        this.code = code; //string representation of this code object's bytecode (contains opcodes e.g. output of dis.dis)
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
})(PyComplex);
exports.PyCodeObject = PyCodeObject;
