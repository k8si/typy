/**
* Created by kate on 9/28/14.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "./opcodes"], function(require, exports, opcodes) {
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

        /** helper function because "in" is weird in javascript **/
        PyCodeObject.prototype.contains = function (list, item) {
            return list.indexOf(item) >= 0;
        };

        /** used by the VM to get the opcode name at index i + the opcode's arg if it has one
        * @return results = [opcode name, opcode number, arg if there is one] **/
        PyCodeObject.prototype.get_byteinfo_at = function (i, lasti) {
            var results = [];
            var op = this.code.value.readUInt8(i);
            var opcName = opcodes.Opcode[op];
            if (opcName) {
                results.push(opcName);
                results.push(op);
            } else
                throw new Error("error in get_byteinfo_at(): unknown opcode: " + op);
            if (op >= opcodes.HAVE_ARGUMENT) {
                var nextBytes = this.code.value.slice(i + 1, i + 2);
                var intArg = nextBytes.readUInt8(0) + (nextBytes.readUInt8(1) << 8);
                var argVal;
                if (this.contains(opcodes.hasArgInNames, op))
                    argVal = this.names.get(intArg);
                else if (this.contains(opcodes.hasArgInConsts, op))
                    argVal = this.consts.get(intArg);
                else if (this.contains(opcodes.hasArgInLocals, op))
                    argVal = this.varnames.get(intArg);
                else if (this.contains(opcodes.hasJrel, op))
                    argVal = lasti + intArg;
                else if (this.contains(opcodes.hasFree, op))
                    console.log("PyCodeObject.get_byteinfo_at(): HASFREE ARG NOT YET IMPLEMENTED"); //TODO
                else if (this.contains(opcodes.hasCompare, op) || this.contains(opcodes.hasJabs, op))
                    argVal = intArg;
                else
                    throw new Error("PyCodeObject.get_byteinfo_at(): opcode " + op + " should have arg but we dont know how to get it");
                results.push(argVal);
            }
            return results;
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
            if (!this.code)
                throw new Error("this PyCodeObject doesnt have any code");
            if (!this.code.value)
                throw new Error("this PyCodeObjects code doesnt have a value");
            for (var i = 0; i < this.code.value.length; i += 3) {
                var op = this.code.value.readUInt8(i);
                console.log("\topname: " + op.toString(16) + " " + opcodes.Opcode[op]);
                if (op >= opcodes.HAVE_ARGUMENT) {
                    var nextBytes = this.code.value.slice(i + 1, i + 2);
                    var idx = nextBytes.readUInt8(0) + (nextBytes.readUInt8(1) << 8);
                    if (this.contains(opcodes.hasArgInNames, op)) {
                        console.log("\t\targ: names @ " + idx + " : " + this.names.get(idx));
                    } else if (this.contains(opcodes.hasArgInConsts, op)) {
                        console.log("\t\targ: consts @ " + idx + " : " + this.consts.get(idx));
                    } else if (this.contains(opcodes.hasArgInLocals, op)) {
                        console.log("\t\targ: varnames @ " + idx + " : " + this.varnames.get(idx));
                    } else if (this.contains(opcodes.hasJrel, op)) {
                        console.log("\t\targ: jrel arg = lasti + " + idx);
                    } else if (this.contains(opcodes.hasFree, op)) {
                        console.log("\t\targ: hasFree --> NOT YET IMPLEMENTED"); //TODO
                    } else {
                        console.log("\t\targ: jabs or compare");
                    }
                }
            }
        };
        return PyCodeObject;
    })(PyComplex);
    exports.PyCodeObject = PyCodeObject;
});
