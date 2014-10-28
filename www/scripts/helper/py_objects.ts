/// <reference path="lib/node/node.d.ts" />
/// <reference path="typings/long/long.d.ts" />

/**
 * Created by kate on 9/28/14.
 */

/*
 TODO this may all be unnecessarily complicated

 TODO PyObjects for StopIter, Ellipsis, PyFloat, PyList, PySet and some others

 TODO change "any"-type fields to something other than "any" (anything that's "any" is "any"
 because I didn't feel like figuring it out at the time)
 */


/*
 TODO:
 PyComplex (complex number)
 PySet
 others....
 */

import opcodes = require("./opcodes");
import utils = require("./utils");
import Long = require("long");


//TODO should be T implements PyObject??
export class PyFunction<T extends PyObject, R extends PyObject> {
    public name: string;
    public obj: T;
    public ret: R;
    public constructor(name: string, obj: T, ret?: R) {
        this.name = name;
        this.obj = obj;
        if (ret) this.ret = ret;
        else this.ret = null;
    }
    public call(args: any[], posArgs?: any[], kwargs?: utils.Dict<any>): R {
        if (this.name in this.obj) {
            if (!this.ret) return this.obj[this.name](args, posArgs, kwargs);
            else return this.ret.createNew(this.obj[this.name](args, posArgs, kwargs));
        } else throw new Error(this.obj.toString() + " doesnt have fxn " + this.name);
    }
    public toString(){ return "(PyFunction " + this.name + " on " + this.obj.toString(); }
}

//make sure that all of the wrapper objects have value and type fields
export interface PyObject {
    value: any;
    type: string;
//    attrs: utils.Dict<PyFunction>;
    toString(): string;
    createNew(args: any): any;
}

//constants
//constants: "null", "none", "stopiter", ... ? dont't reeally need objects

export class PyNull implements PyObject {
    public value = null;
    public type = "null";
    public toString(): string { return "< PyNull >"; }
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
}

export class PyNone implements PyObject {
    public value = undefined;
    public type = "none";
    public toString(): string { return "< PyNone >"; }
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
}

export class PyStopIter implements PyObject {
    public value = "stopiter";
    public type = "stopiter";
    public toString(): string { return "< PyStopIter >"; }
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
}

export class PyEllipsis implements PyObject {
    public value = "...";
    public type = "ellipsis";
    public toString(): string { return "< PyEllipsis >"; }
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
}

export class PyTrue implements PyObject {
    public value: boolean = true;
    public type = "true";
    public toString(): string { return "< PyTrue >"; }
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
}

export class PyFalse implements PyObject {
    public value:boolean = false;
    public type = "false";
    public toString(): string { return "< PyFalse >"; }
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs");
//        else return this.attrs.get(attr);
//    }
}


export class PyInt implements PyObject {
    public value: number;
    public sign: number;
    public type = "int";
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs");
//        else return this.attrs.get(attr);
//    }
    constructor(value: number){
        this.value = value;
    }
    public toString(): string { return "(PyInt "+ this.value.toString() + ")"; }
}



//TODO should this really be of type Long ?
export class PyInt64 implements PyObject {
    public value: dcodeIO.Long; //should be type Long?
    public type = "int64";
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }

    constructor(value: dcodeIO.Long) {
        this.value = value;
    }
    public toString(): string { return "<PyInt64 "+ this.value.toString() + ">"; }

}


/**
 * TODO PyLong.value should be specified as type "Long" (or LongStatic?) however I get a compiler error:
 * /Users/kate/630/630-proj1/src/py_objects.ts(93,38): error TS4022: Type reference cannot refer to container 'Long'.
 */
export class PyLong implements PyObject {
    public value: dcodeIO.Long;
    public type = "long";
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
    constructor(value: dcodeIO.Long){
        this.value=value;
    }
    public toString(): string { return "<PyLong "+ this.value.toString() + ">"; }

}

export class PyFloat implements PyObject {
    public value: number; //TODO should be Long too?
    public type = "float";
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
    constructor(value: number) {
        this.value = value;
    }
    public toString(): string { return "<PyFloat "+ this.value.toString() + ">"; }

}

export class PyString implements PyObject {
//    public value: string;
    public value: Buffer;
    public type = "string";
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
    constructor(value: Buffer){
        this.value = value; //.toString();
    }
    //for reading bytecode byte by byte in PyCodeObject methods
//    public toBuffer(): Buffer { return new Buffer(this.value); }
    public toString(): string { return "<PyString '" + this.value.toString() + "'>"}
}

export class PyInterned implements PyObject {
//    public value: Buffer;
    public value: string;
    public type = "interned-string";
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
    constructor(value: Buffer) {
        this.value = value.toString();
    }
    public toString(): string { return "<PyInterned '"+ this.value.toString() + "'>"; }

}

export class PyStringRef implements PyObject {
//    public value: Buffer;
    public value: string;
    public type = "string-ref";
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
    constructor(value: Buffer) {
        this.value = value.toString();
    }
    public toString(): string { return "<PyStringRef '"+ this.value.toString() + "'>"; }
}

export class PyUnicode implements PyObject {
    public value: string;
    public type = "unicode";
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
    constructor(value: string) {
        this.value = value;
    }
    public toString(): string { return "<PyUnicode '" + this.value + "'>"; }
}


export interface PyCollection {
    get(key: any): any;
    size(): number;
}

//make sure that all of the wrapper objects have value and type fields
export class PyTuple implements PyObject, PyCollection {
    public value:any[];
    public type = "tuple";
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }
    constructor(value:any[]){
        this.value = value;
    }
    public toString(): string {
        var info = "";
        if (this.value) {
            for (var i = 0; i < this.value.length; i++) {
                if (this.value[i]) info = info + " " + this.value[i].toString();
                else info = info + " [undefined@"+ i + "] ";
                info = info + ", ";
            }
        }
        return " <PyTuple with "+this.value.length+" elements: ( " + info + " ) >"
    }
    public length(): number {
        return this.value.length;
    }
    public size(): number { return this.length(); }
    public get(idx:number): any {
        if (idx >= 0 && idx < this.value.length) return this.value[idx];
        else return null;
    }
    public pop(idx: number): any {
        if (idx >= 0 && idx < this.value.length) return this.value.splice(idx, 1);
        else return null;
    }
}

export class PyList implements PyObject, PyCollection {
    public value:any[];
    public type = "list";
    public createNew(args: any): PyList { return new PyList(args); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs");
//        else return this.attrs.get(attr);
//    }
    constructor(value?:any[]){
        if (value) this.value = value;
        else this.value = [];
    }

    public length(): number { return this.value.length; }
    public size(): number { return this.length(); }

    public get(idx:number): any {
        if (idx >= 0 && idx < this.value.length) return this.value[idx];
        else if (idx < 0 && Math.abs(idx) < this.value.length) return this.value[this.value.length+idx];
        else return null;
    }

    public toString(): string {
        var s = "(PyList [";
        for (var i = 0; i < this.value.length; i++) s += this.value[i].toString() + ", ";
        s += "] )";
        return s;
    }
}

export class PyDict implements PyObject, PyCollection {
    public value: utils.Dict<any>;
    public type = "dict";
    public attrs = new utils.Dict<PyFunction<PyDict, any>>(["str"], [new PyFunction<PyDict, PyString>("str", this)]); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);

    public createNew(args: any): any { throw new Error("not yet implemented"); }

    constructor(value?: utils.Dict<any>){
        if (value) this.value = value;
        else this.value = new utils.Dict<any>();
        this.attrs.add("keys", new PyFunction<PyDict, PyList>("keys", this, new PyList()));

    }

    public getAttr(attr: string): any {
        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs");
        else return this.attrs.get(attr);
    }

    public get(key: string): any {
        return this.value.get(key);
    }

    public contains(key: string): boolean { return this.value.contains(key); }

    public add(key: string, value: any){
        this.value.add(key, value);
    }

    public update(dict: PyDict): void {
        this.value.update(dict.value);
    }

    public length(): number { return this.value.size(); }
    public size(): number { return this.length(); }
    public keys(): string[] { return this.value.keys(); }
    public values(): any[] { return this.value.values(); }

    public toString(): string { return this.value.toString(); }
}

export class PyCodeObject implements PyObject {
    public value = "code-object";
    public type = "code-object";
    public createNew(args: any): any { throw new Error("not yet implemented"); }

//    public attrs = new utils.Dict<PyFunction>("toString", this); //BuiltinFactory.make(["value", "type", "toString"], [this.value, this.type, this.toString]);
//    public getAttr(attr: string): any {
//        if (!this.attrs.contains(attr)) throw new Error("getAttr: key error - key " + attr + " not in this object's attrs")
//        else return this.attrs.get(attr);
//    }

    argcount:number;
    nlocals:number;
    stacksize:number;
    flags:number;

    code:PyString;

    consts:PyTuple;
    names:PyTuple;
    varnames:PyTuple;
    freevars:PyTuple; //TODO what is this for?
    cellvars:PyTuple; //TODO what is this for?

    filename:PyString;
    name:any;
    firstlineno:number;
    lnotab:any;

    constructor(offset:number,
                argcount:number,
                nlocals:number,
                stacksize:number,
                flags:number,
                code:PyString,

                consts:PyTuple,
                names:PyTuple,
                varnames:PyTuple,
                freevars:PyTuple,
                cellvars:PyTuple,

                filename:PyString, //string or PyString?
                name:any,
                firstlineno:number,
                lnotab:any)
    {
//        super(offset, "code_object");
        this.argcount=argcount;
        this.nlocals=nlocals;
        this.stacksize=stacksize;
        this.flags=flags;
        this.code=code; //string representation of this code object's bytecode (contains opcodes e.g. output of dis.dis)
        this.consts=consts;
        this.names=names;
        this.varnames=varnames;
        this.freevars=freevars;
        this.cellvars=cellvars;
        this.filename=filename;
        this.name=name;
        this.firstlineno=firstlineno;
        this.lnotab=lnotab;
    }

    public toString(): string {
        var info = "<PyCodeObject argcount:"+this.argcount + " nlocals:" + this.nlocals + " stacksize:" + this.stacksize + " flags:" + this.flags + "\n";
        if (this.names) info += "names: " + this.names.toString() + " \n";
        if (this.consts) info += "consts: " + this.consts.toString() + " \n";
        if (this.varnames) info += "locals: " + this.varnames.toString() + " \n";
        info += "filename: " + this.filename.value.toString() + "\n";

        return info;
    }

    /** helper function because "in" is weird in javascript **/
    private contains(list:any[], item:any): boolean { return list.indexOf(item) >= 0 ;}

    /** used by the VM to get the opcode name at index i + the opcode's arg if it has one
     * @return results = [opcode name, opcode number, arg if there is one] **/
    public get_byteinfo_at(i:number, lasti:number): any[] {
        var results = [];
        var byteCode = this.code.value; //.toBuffer();
//        console.log("get_byteinfo_at idx = " + i + " / " + byteCode.length);

        if (i >= byteCode.length) {
            console.log("ERROR: PyCodeObject get_byteinfo_at(): index " + i + " out of range (len = " + byteCode.length + ")");
            return results;
        }
        var op = byteCode.readUInt8(i);
        var opcName = opcodes.Opcode[op];
        if (opcName) {results.push(opcName); results.push(op); }
        else throw new Error("error in get_byteinfo_at(): unknown opcode: " + op);
        if (op >= opcodes.HAVE_ARGUMENT) {
            if (i+2 >= byteCode.length) throw new Error("PyCodeObject get_byteinfo_at(): index " + i+2 + " out of range.");
            var nextBytes = byteCode.slice(i+1, i+2);
            var intArg = nextBytes.readUInt8(0) + (nextBytes.readUInt8(1) << 8);
            var argVal;
            if (this.contains(opcodes.hasArgInNames, op)) argVal = this.names.get(intArg);
            else if (this.contains(opcodes.hasArgInConsts, op)) {

                argVal = this.consts.get(intArg);
            }
            else if (this.contains(opcodes.hasArgInLocals, op)) argVal = this.varnames.get(intArg);
            else if (this.contains(opcodes.hasJrel, op)) argVal = lasti + intArg;
            else if (this.contains(opcodes.hasFree, op)) console.log("PyCodeObject.get_byteinfo_at(): HASFREE ARG NOT YET IMPLEMENTED"); //TODO
            else if (this.contains(opcodes.hasCompare, op) || this.contains(opcodes.hasJabs, op)) argVal = intArg;
            else throw new Error("PyCodeObject.get_byteinfo_at(): opcode " + op + " should have arg but we dont know how to get it");
            results.push(argVal);
        }

        return results;
    }

    public print_co_code(): void {

        if (this.name) console.log("name: " + this.name.toString());
        if (this.filename) console.log("filename: " + this.filename.toString());
        if (this.firstlineno) console.log("firstlineno: " + this.firstlineno);
        if (this.lnotab) console.log("lnotab: " + this.lnotab.toString());
        if (this.varnames) console.log("varnames: " + this.varnames.toString());
        if (this.names) console.log("names: " + this.names.toString());
        if (this.consts) console.log("consts: " + this.consts.toString());
        if (this.freevars) console.log("freevars: " + this.freevars.toString());
        if (this.cellvars) console.log("cellvars: " + this.cellvars.toString());
        if (!this.code) throw new Error("this PyCodeObject doesnt have any code");
        if (!this.code.value) throw new Error("this PyCodeObjects code doesnt have a value");

        console.log("");

        var byteCode: Buffer = this.code.value; //toBuffer();

        var info = "";
        var idx = 0;
        while (idx < byteCode.length) {
            var op = byteCode.readUInt8(idx);
            idx++;
            var opName = opcodes.Opcode[op];
            info += op + " " + opName + "\t";
            if (!opName) throw new Error("PyCodeObject: invalid opcode " + op);
            if (op >= opcodes.HAVE_ARGUMENT) {
                var a1 = byteCode.readUInt8(idx);
                var a2 = byteCode.readUInt8(idx+1);
                idx += 2;
                var intArg = a1 + (a2 << 8);
                if (this.contains(opcodes.hasArgInNames, op)) {
                    info += "arg: names @ " + intArg + " : " + this.names.get(intArg);
                } else if (this.contains(opcodes.hasArgInConsts, op)) {
                    if (this.consts.type == "stopiter") info += "arg: consts @ " + intArg + " : " + this.consts.toString(); //console.log("\t\targ: consts @ " + idx + " : " + this.consts.toString());
                    else info += "arg: consts @ " + intArg + " : " + this.consts.get(intArg); //console.log("\t\targ: consts @ " + idx + " : " + this.consts.get(idx));
                } else if (this.contains(opcodes.hasArgInLocals, op)) {
                    info += "arg: varnames @ " + intArg + " : " + this.varnames.get(intArg);
                } else if (this.contains(opcodes.hasJrel, op)) {
                    info += "arg: jrel arg = lasti + " + intArg;
                } else if (this.contains(opcodes.hasFree, op)) {
                    throw new Error("PyCodeObject: hasFree arg not yet implemented");
                } else {
                    info += "arg: jabs or compare";
                }
            }
            console.log(info);
            info = "";
        }
    }
}




