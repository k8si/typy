/// <reference path="../lib/node/node.d.ts" />
/// <reference path="../typings/long/long.d.ts" />
define(["require", "exports", "./opcodes"], function(require, exports, opcodes) {
    

    var PyNull = (function () {
        function PyNull() {
            this.value = null;
            this.type = "null";
        }
        PyNull.prototype.toString = function () {
            return "< PyNull >";
        };
        return PyNull;
    })();
    exports.PyNull = PyNull;

    var PyNone = (function () {
        function PyNone() {
            this.value = undefined;
            this.type = "none";
        }
        PyNone.prototype.toString = function () {
            return "< PyNone >";
        };
        return PyNone;
    })();
    exports.PyNone = PyNone;

    var PyStopIter = (function () {
        function PyStopIter() {
            this.value = "stopiter";
            this.type = "stopiter";
        }
        PyStopIter.prototype.toString = function () {
            return "< PyStopIter >";
        };
        return PyStopIter;
    })();
    exports.PyStopIter = PyStopIter;

    var PyEllipsis = (function () {
        function PyEllipsis() {
            this.value = "...";
            this.type = "ellipsis";
        }
        PyEllipsis.prototype.toString = function () {
            return "< PyEllipsis >";
        };
        return PyEllipsis;
    })();
    exports.PyEllipsis = PyEllipsis;

    var PyTrue = (function () {
        function PyTrue() {
            this.value = true;
            this.type = "true";
        }
        PyTrue.prototype.toString = function () {
            return "< PyTrue >";
        };
        return PyTrue;
    })();
    exports.PyTrue = PyTrue;

    var PyFalse = (function () {
        function PyFalse() {
            this.value = false;
            this.type = "false";
        }
        PyFalse.prototype.toString = function () {
            return "< PyFalse >";
        };
        return PyFalse;
    })();
    exports.PyFalse = PyFalse;

    //// abstract wrapper class for "complex" Python types which contain data
    //export class PyComplex extends PyObject {
    //    offset:number;
    //    type:string;
    //    constructor(offset:number, type:string){
    //        super(1, "");
    //        this.offset = offset;
    //        this.type = type;
    //    }
    //}
    var PyInt = (function () {
        function PyInt(value) {
            this.type = "int";
            this.value = value;
        }
        PyInt.prototype.toString = function () {
            return "<PyInt " + this.value.toString() + ">";
        };
        return PyInt;
    })();
    exports.PyInt = PyInt;

    //TODO should this really be of type Long ?
    var PyInt64 = (function () {
        function PyInt64(value) {
            this.type = "int64";
            this.value = value;
        }
        PyInt64.prototype.toString = function () {
            return "<PyInt64 " + this.value.toString() + ">";
        };
        return PyInt64;
    })();
    exports.PyInt64 = PyInt64;

    /**
    * TODO PyLong.value should be specified as type "Long" (or LongStatic?) however I get a compiler error:
    * /Users/kate/630/630-proj1/src/py_objects.ts(93,38): error TS4022: Type reference cannot refer to container 'Long'.
    */
    var PyLong = (function () {
        function PyLong(value) {
            this.type = "long";
            this.value = value;
        }
        PyLong.prototype.toString = function () {
            return "<PyLong " + this.value.toString() + ">";
        };
        return PyLong;
    })();
    exports.PyLong = PyLong;

    var PyFloat = (function () {
        function PyFloat(value) {
            this.type = "float";
            this.value = value;
        }
        PyFloat.prototype.toString = function () {
            return "<PyFloat " + this.value.toString() + ">";
        };
        return PyFloat;
    })();
    exports.PyFloat = PyFloat;

    var PyString = (function () {
        function PyString(value) {
            this.type = "string";
            this.value = value.toString();
        }
        //for reading bytecode byte by byte in PyCodeObject methods
        PyString.prototype.toBuffer = function () {
            return new Buffer(this.value);
        };
        PyString.prototype.toString = function () {
            return "<PyString '" + this.value.toString() + "'>";
        };
        return PyString;
    })();
    exports.PyString = PyString;

    var PyInterned = (function () {
        function PyInterned(value) {
            this.type = "interned-string";
            this.value = value.toString();
        }
        PyInterned.prototype.toString = function () {
            return "<PyInterned '" + this.value.toString() + "'>";
        };
        return PyInterned;
    })();
    exports.PyInterned = PyInterned;

    var PyStringRef = (function () {
        function PyStringRef(value) {
            this.type = "string-ref";
            this.value = value.toString();
        }
        PyStringRef.prototype.toString = function () {
            return "<PyStringRef '" + this.value.toString() + "'>";
        };
        return PyStringRef;
    })();
    exports.PyStringRef = PyStringRef;

    var PyUnicode = (function () {
        function PyUnicode(value) {
            this.type = "unicode";
            this.value = value;
        }
        PyUnicode.prototype.toString = function () {
            return "<PyUnicode '" + this.value + "'>";
        };
        return PyUnicode;
    })();
    exports.PyUnicode = PyUnicode;

    var PyTuple = (function () {
        function PyTuple(value) {
            this.type = "tuple";
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
    })();
    exports.PyTuple = PyTuple;

    //export class PyList extends PyComplex {
    //    value:any[];
    //    constructor(offset:number, value:any[]){
    //        super(offset, "list");
    //        this.value = value;
    //    }
    //
    //}
    //
    //export class PyDict extends PyComplex {
    //    value: utils.Dict<any>;
    //    constructor(offset:number, value: utils.Dict<any>) {
    //        super(offset, "dict");
    //        this.value = value;
    //    }
    //    public toString(): string { return "< PyDict with " + this.value.size() + " items >"; }
    //}
    //
    //export class PyFrozenSet extends PyComplex {
    //    value:any;
    //    constructor(offset:number, value:any) {
    //        super(offset, "set");
    //        this.value = value;
    //    }
    //}
    var PyCodeObject = (function () {
        function PyCodeObject(offset, argcount, nlocals, stacksize, flags, code, consts, names, varnames, freevars, cellvars, filename, name, firstlineno, lnotab) {
            this.value = "code-object";
            this.type = "code-object";
            //        super(offset, "code_object");
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
            var byteCode = this.code.toBuffer();
            var op = byteCode.readUInt8(i);
            var opcName = opcodes.Opcode[op];
            if (opcName) {
                results.push(opcName);
                results.push(op);
            } else
                throw new Error("error in get_byteinfo_at(): unknown opcode: " + op);
            if (op >= opcodes.HAVE_ARGUMENT) {
                var nextBytes = byteCode.slice(i + 1, i + 2);
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
            var byteCode = this.code.toBuffer();
            for (var i = 0; i < this.code.value.length; i += 3) {
                var op = byteCode.readUInt8(i);
                console.log("\topname: " + op.toString(16) + " " + opcodes.Opcode[op]);
                if (op >= opcodes.HAVE_ARGUMENT) {
                    var nextBytes = byteCode.slice(i + 1, i + 2);
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
    })();
    exports.PyCodeObject = PyCodeObject;
});
