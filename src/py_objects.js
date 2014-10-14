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
PyComplex (complex number)
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
        this.value = null;
    }
    PyNull.prototype.toString = function () {
        return "< PyNull >";
    };
    return PyNull;
})(PyPrimitive);
exports.PyNull = PyNull;

var PyNone = (function (_super) {
    __extends(PyNone, _super);
    function PyNone(offset) {
        _super.call(this, offset, "none");
        this.value = undefined;
    }
    PyNone.prototype.toString = function () {
        return "< PyNone >";
    };
    return PyNone;
})(PyPrimitive);
exports.PyNone = PyNone;

var PyStopIter = (function (_super) {
    __extends(PyStopIter, _super);
    function PyStopIter(offset) {
        _super.call(this, offset, "stopiter");
    }
    PyStopIter.prototype.toString = function () {
        return "< PyStopIter >";
    };
    return PyStopIter;
})(PyPrimitive);
exports.PyStopIter = PyStopIter;

var PyEllipsis = (function (_super) {
    __extends(PyEllipsis, _super);
    function PyEllipsis(offset) {
        _super.call(this, offset, "ellipsis");
    }
    PyEllipsis.prototype.toString = function () {
        return "< PyEllipsis >";
    };
    return PyEllipsis;
})(PyPrimitive);
exports.PyEllipsis = PyEllipsis;

var PyTrue = (function (_super) {
    __extends(PyTrue, _super);
    function PyTrue(offset) {
        _super.call(this, offset, "true");
        this.value = true;
    }
    PyTrue.prototype.toString = function () {
        return "< PyTrue >";
    };
    return PyTrue;
})(PyPrimitive);
exports.PyTrue = PyTrue;

var PyFalse = (function (_super) {
    __extends(PyFalse, _super);
    function PyFalse(offset) {
        _super.call(this, offset, "false");
        this.value = false;
    }
    PyFalse.prototype.toString = function () {
        return "< PyFalse >";
    };
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
    PyInt.prototype.toString = function () {
        return "<PyInt " + this.value.toString() + ">";
    };
    return PyInt;
})(PyComplex);
exports.PyInt = PyInt;

/**
* TODO not sure if value should be type Long?
*/
var PyInt64 = (function (_super) {
    __extends(PyInt64, _super);
    function PyInt64(offset, value) {
        _super.call(this, offset, "int64");
        this.value = value;
    }
    PyInt64.prototype.toString = function () {
        return "<PyInt64 " + this.value.toString() + ">";
    };
    return PyInt64;
})(PyComplex);
exports.PyInt64 = PyInt64;

/**
* TODO PyLong.value should be specified as type "Long" (or LongStatic?) however I get a compiler error:
* /Users/kate/630/630-proj1/src/py_objects.ts(93,38): error TS4022: Type reference cannot refer to container 'Long'.
*/
var PyLong = (function (_super) {
    __extends(PyLong, _super);
    function PyLong(offset, value) {
        _super.call(this, offset, "long");
        this.value = value;
    }
    PyLong.prototype.toString = function () {
        return "<PyLong " + this.value.toString() + ">";
    };
    return PyLong;
})(PyComplex);
exports.PyLong = PyLong;

var PyFloat = (function (_super) {
    __extends(PyFloat, _super);
    function PyFloat(offset, value) {
        _super.call(this, offset, "float");
        this.value = value;
    }
    PyFloat.prototype.toString = function () {
        return "<PyFloat " + this.value.toString() + ">";
    };
    return PyFloat;
})(PyComplex);
exports.PyFloat = PyFloat;

//TODO value should be string instead of Buffer?
var PyString = (function (_super) {
    __extends(PyString, _super);
    function PyString(offset, value) {
        _super.call(this, offset, "string");
        this.value = value;
    }
    PyString.prototype.toString = function () {
        return "<PyString '" + this.value.toString() + "'>";
    };
    return PyString;
})(PyComplex);
exports.PyString = PyString;

var PyInterned = (function (_super) {
    __extends(PyInterned, _super);
    function PyInterned(offset, value) {
        _super.call(this, offset, "interned");
        this.value = value;
    }
    PyInterned.prototype.toString = function () {
        return "<PyInterned '" + this.value.toString() + "'>";
    };
    return PyInterned;
})(PyComplex);
exports.PyInterned = PyInterned;

var PyStringRef = (function (_super) {
    __extends(PyStringRef, _super);
    function PyStringRef(offset, value) {
        _super.call(this, offset, "stringref");
        this.value = value;
    }
    PyStringRef.prototype.toString = function () {
        return "<PyStringRef '" + this.value.toString() + "'>";
    };
    return PyStringRef;
})(PyComplex);
exports.PyStringRef = PyStringRef;

var PyUnicode = (function (_super) {
    __extends(PyUnicode, _super);
    function PyUnicode(offset, value) {
        _super.call(this, offset, "unicode");
        this.value = value;
    }
    PyUnicode.prototype.toString = function () {
        return "<PyUnicode '" + this.value + "'>";
    };
    return PyUnicode;
})(PyComplex);
exports.PyUnicode = PyUnicode;

var PyTuple = (function (_super) {
    __extends(PyTuple, _super);
    function PyTuple(offset, value) {
        _super.call(this, offset, "tuple");
        this.value = value;
    }
    PyTuple.prototype.toString = function () {
        var info = "";
        if (this.value) {
            for (var i = 0; i < this.value.length; i++) {
                if (this.value[i])
                    info = info + " " + this.value[i].toString();
                else
                    info = info + " [undefined@" + i + "] ";
                info = info + ", ";
            }
        }
        return " <PyTuple with " + this.value.length + " elements: ( " + info + " ) >";
    };
    PyTuple.prototype.length = function () {
        return this.value.length;
    };
    PyTuple.prototype.get = function (idx) {
        if (idx >= 0 && idx < this.value.length)
            return this.value[idx];
        else
            return null;
    };
    PyTuple.prototype.pop = function (idx) {
        if (idx >= 0 && idx < this.value.length)
            return this.value.splice(idx, 1);
        else
            return null;
    };
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
    PyDict.prototype.toString = function () {
        return "< PyDict with " + this.value.size() + " items >";
    };
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
        var info = "argcount:" + this.argcount + " nlocals:" + this.nlocals + " stacksize:" + this.stacksize + " flags:" + this.flags;
        var names;
        if (this.names)
            names = "names: " + this.names.toString();
        else
            names = "";
        var name;
        if (this.name)
            name = "name: " + this.name.toString();
        else
            name = "";
        var fname;
        if (this.filename)
            fname = "filename: " + this.filename;
        else
            fname = "";
        return "<PyCodeObject " + info + " " + names + " " + name + " " + fname + " >";
    };

    PyCodeObject.prototype.get_byteinfo_at = function (idx) {
        var results = [];
        var buf = this.code.value;
        var i = idx;
        if (buf && i < buf.length) {
            var opc_name = opcodes.Opcode[buf[idx]];
            results.push(opc_name);
            i++;
            if (!(opc_name in opcodes.OpsWithArgs) || i + 2 >= buf.length)
                return results;
            var opc = opcodes.OpsWithArgs[opc_name];

            // from byterun: intArg = byteint(arg[0]) + (byteint(arg[1]) << 8)
            var nextBytes = buf.slice(i, i + 2);
            var intArg = nextBytes[0] + (nextBytes[1] << 8);
            i += 2;
            var argVal;
            if (opc.args == "const") {
                argVal = this.consts.get(intArg);
            } else if (opc.args == "locals") {
                argVal = this.varnames.get(intArg);
            } else if (opc.args == "names") {
                argVal = this.names.get(intArg);
            } else {
                console.log("args don't match: " + opc.args);
            }

            //TODO LOAD_CLOSURE, LOAD_DEREF, STORE_DEREF w/cellvars / freevars
            if (argVal)
                results.push(argVal);
        } else
            throw new Error("PyCodeObject: error in get_byteinfo_at");
        return results;
    };

    PyCodeObject.prototype.parse_code = function () {
        var result = [];
        var buf = this.code.value;
        if (buf) {
            var i = 0;
            var thisResult = [];
            while (i < buf.length) {
                var opc_name = opcodes.Opcode[buf[i]];
                thisResult.push(opc_name);
                i++;
                if (!(opc_name in opcodes.OpsWithArgs) || i + 2 >= buf.length)
                    break;
                var opc = opcodes.OpsWithArgs[opc_name];

                // from byterun: intArg = byteint(arg[0]) + (byteint(arg[1]) << 8)
                var nextBytes = buf.slice(i, i + 2);
                var intArg = nextBytes[0] + (nextBytes[1] << 8);
                i += 2;
                var argVal;
                if (opc.args == "const") {
                    argVal = this.consts.get(intArg);
                } else if (opc.args == "locals") {
                    argVal = this.varnames.get(intArg);
                } else if (opc.args == "names") {
                    argVal = this.names.get(intArg);
                } else {
                    console.log("args don't match: " + opc.args);
                }

                //TODO LOAD_CLOSURE, LOAD_DEREF, STORE_DEREF w/cellvars / freevars
                if (argVal)
                    thisResult.push(argVal.toString());
                result.push(thisResult);
            }
        } else
            throw new Error("this PyCodeObject's co_code is undefined");

        for (var k = 0; k < result.length; k++) {
            console.log(result[k]);
        }
        return result;
    };

    PyCodeObject.prototype.print_co_code = function () {
        console.log("--> CO_CODE <--");
        if (this.firstlineno)
            console.log("firstlineno: " + this.firstlineno);
        if (this.lnotab)
            console.log("lnotab: " + this.lnotab.toString());
        if (this.varnames)
            console.log("varnames: " + this.varnames.toString());
        if (this.names)
            console.log("names: " + this.names.toString());
        if (this.consts)
            console.log("consts: " + this.consts.toString());
        if (this.freevars)
            console.log("freevars: " + this.freevars.toString());
        if (this.cellvars)
            console.log("cellvars: " + this.cellvars.toString());

        var buf = this.code.value;

        if (buf) {
            var i = 0;
            while (i < buf.length) {
                console.log("\t OPNAME: " + buf[i].toString(16) + " " + opcodes.Opcode[buf[i]]); //+ " -- " + opcodes.BetterOpcodes[opcodes.Opcode[buf[i]]]);

                var opc_name = opcodes.Opcode[buf[i]];
                i++;

                //                if (i + 2 >= buf.length) break;
                //                if (!(opc_name in opcodes.OpsWithArgs) continue;//|| i + 2 >= buf.length) break;
                var opc = opcodes.OpsWithArgs[opc_name];
                if (opc) {
                    //                var idx = buf.readInt16LE(i);
                    var nextBytes = buf.slice(i, i + 2);
                    var idx = nextBytes[0] + (nextBytes[1] << 8);
                    i += 2;

                    if (opc.args == "const") {
                        console.log("\t\targ: consts @ " + idx + " : " + this.consts.get(idx));
                    } else if (opc.args == "locals") {
                        console.log("\t\targ: varnames @ " + idx + " : " + this.varnames.get(idx));
                    } else if (opc.args == "names") {
                        console.log("\t\targ: names @ " + idx + " : " + this.names.get(idx));
                    } else if (opc.args == "jrel") {
                        console.log("\t\targ: jrel arg = lasti + " + idx);
                    } else if (opc.args == "jabs") {
                        console.log("\t\targ: jabs arg = " + idx);
                    } else {
                        console.log("args don't match: " + opc.args);
                    }
                    //TODO LOAD_CLOSURE, LOAD_DEREF, STORE_DEREF w/cellvars / freevars
                }
            }
        } else
            throw new Error("this PyCodeObject's co_code is undefined");
    };
    return PyCodeObject;
})(PyComplex);
exports.PyCodeObject = PyCodeObject;
