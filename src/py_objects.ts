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
 PyUnicode
 PyComplex (complex number)
 PySet
 */

import opcodes = require("./opcodes");
import utils = require("./utils");
import Long = require("long");



export class PyObject { }

// abstract wrapper class "simple" Python types which contain no data
export class PyPrimitive extends PyObject {
    offset:number; //location of the object's start index in the PYC file
    type:string;
    constructor(offset:number, type:string){
        super();
        this.offset = offset;
        this.type = type;
    }
}

export class PyNull extends PyPrimitive {
    value:any = null;
    constructor(offset:number) {
        super(offset, "null")
    }
    public toString(): string { return "< PyNull >"; }
}

export class PyNone extends PyPrimitive {
    value:any = undefined;
    constructor(offset:number) { super(offset, "none"); }
    public toString(): string { return "< PyNone >"; }
}

export class PyStopIter extends PyPrimitive {
    constructor(offset: number) { super(offset, "stopiter"); }
    public toString(): string { return "< PyStopIter >"; }
}

export class PyEllipsis extends PyPrimitive {
    constructor(offset: number) { super(offset, "ellipsis"); }
    public toString(): string { return "< PyEllipsis >"; }
}

export class PyTrue extends PyPrimitive {
    value:boolean = true;
    constructor(offset:number) {
        super(offset, "true");
    }
    public toString(): string { return "< PyTrue >"; }

}

export class PyFalse extends PyPrimitive {
    value:boolean = false;
    constructor(offset:number) {
        super(offset, "false");
    }
    public toString(): string { return "< PyFalse >"; }
}


// abstract wrapper class for "complex" Python types which contain data
export class PyComplex extends PyObject {
    offset:number;
    type:string;
    constructor(offset:number, type:string){
        super();
        this.offset = offset;
        this.type = type;
    }
}

export class PyInt extends PyComplex {
    value:number;
    constructor(offset:number, value:number){
        super(offset, "int");
        this.value=value;
    }
    public toString(): string { return "<PyInt "+ this.value.toString() + ">"; }

}

/**
 * TODO not sure if value should be type Long?
 */
export class PyInt64 extends PyComplex {
    value:any; //should be type Long?
    constructor(offset:number, value:any) {
        super(offset, "int64");
        this.value = value;
    }
    public toString(): string { return "<PyInt64 "+ this.value.toString() + ">"; }

}


/**
 * TODO PyLong.value should be specified as type "Long" (or LongStatic?) however I get a compiler error:
 * /Users/kate/630/630-proj1/src/py_objects.ts(93,38): error TS4022: Type reference cannot refer to container 'Long'.
 */
export class PyLong extends PyComplex {
    value:any;
    constructor(offset:number, value:any){
        super(offset, "long");
        this.value=value;
    }
    public toString(): string { return "<PyLong "+ this.value.toString() + ">"; }

}

export class PyFloat extends PyComplex {
    value:number;
    constructor(offset:number, value:number) {
        super(offset, "float");
        this.value = value;
    }
    public toString(): string { return "<PyFloat "+ this.value.toString() + ">"; }

}

//TODO value should be string instead of Buffer?
export class PyString extends PyComplex {
    value:Buffer;
    constructor(offset:number, value:Buffer){
        super(offset, "string");
        this.value=value;
    }
    public toString(): string { return "<PyString '" + this.value.toString() + "'>"}
}

export class PyInterned extends PyComplex {
    value: Buffer;
    constructor(offset: number, value: Buffer) {
        super(offset, "interned");
        this.value = value;
    }
    public toString(): string { return "<PyInterned '"+ this.value.toString() + "'>"; }

}

export class PyStringRef extends PyComplex {
    value: Buffer;
    constructor(offset: number, value: Buffer) {
        super(offset, "stringref");
        this.value = value;
    }
    public toString(): string { return "<PyStringRef '"+ this.value.toString() + "'>"; }
}

export class PyUnicode extends PyComplex {
    value: string;
    constructor(offset: number, value: string) {
        super(offset, "unicode");
        this.value = value;
    }
    public toString(): string { return "<PyUnicode '" + this.value + "'>"; }
}

export class PyTuple extends PyComplex {
    value:any[];
    constructor(offset:number, value:any[]){
        super(offset, "tuple");
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
    public length(): number { return this.value.length; }
    public get(idx:number): any {
        if (idx >= 0 && idx < this.value.length) return this.value[idx];
        else return null;
    }
    public pop(idx: number): any {
        if (idx >= 0 && idx < this.value.length) return this.value.splice(idx, 1);
        else return null;
    }
}

export class PyList extends PyComplex {
    value:any[];
    constructor(offset:number, value:any[]){
        super(offset, "list");
        this.value = value;
    }

}

export class PyDict extends PyComplex {
    value: utils.Dict<any>;
    constructor(offset:number, value: utils.Dict<any>) {
        super(offset, "dict");
        this.value = value;
    }
    public toString(): string { return "< PyDict with " + this.value.size() + " items >"; }
}

export class PyFrozenSet extends PyComplex {
    value:any;
    constructor(offset:number, value:any) {
        super(offset, "set");
        this.value = value;
    }
}



export class PyCodeObject extends PyComplex {

    argcount:number;
    nlocals:number;
    stacksize:number;
    flags:number;
    code:PyString;
    consts:PyTuple;
    names:PyTuple;
    varnames:PyTuple;
    freevars:PyTuple; //TODO what is this for?
    public cellvars:PyTuple; //TODO what is this for?
    filename:PyString;
    name:any;
    public firstlineno:number;
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
        super(offset, "code_object");
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
        var info = "argcount:"+this.argcount + " nlocals:" + this.nlocals + " stacksize:" + this.stacksize + " flags:" + this.flags;
        var names;
        if (this.names)
            names = "names: " + this.names.toString();
        else names = "";
        var name;
        if (this.name) name = "name: " + this.name.toString();
        else name = "";
        var fname;
        if (this.filename) fname = "filename: " + this.filename;
        else fname = "";
        return "<PyCodeObject " + info + " " + names + " " + name + " " + fname + " >";
    }

    /** helper function because "in" is weird in javascript **/
    private contains(list:any[], item:any): boolean { return list.indexOf(item) >= 0 ;}

    /** used by the VM to get the opcode name at index i + the opcode's arg if it has one
     * @return results = [opcode name, opcode number, arg if there is one] **/
    public get_byteinfo_at(i:number, lasti:number): any[] {
        var results = [];
        var op = this.code.value.readUInt8(i);
        var opcName = opcodes.Opcode[op];
        if (opcName) {results.push(opcName); results.push(op); }
        else throw new Error("error in get_byteinfo_at(): unknown opcode: " + op);
        if (op >= opcodes.HAVE_ARGUMENT) {
            var nextBytes = this.code.value.slice(i+1, i+2);
            var intArg = nextBytes.readUInt8(0) + (nextBytes.readUInt8(1) << 8);
            var argVal;
            if (this.contains(opcodes.hasArgInNames, op)) argVal = this.names.get(intArg);
            else if (this.contains(opcodes.hasArgInConsts, op)) argVal = this.consts.get(intArg);
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
        console.log("--> CO_CODE <--");
        if (this.firstlineno) console.log("firstlineno: " + this.firstlineno);
        if (this.lnotab) console.log("lnotab: " + this.lnotab.toString());
        if (this.varnames) console.log("varnames: " + this.varnames.toString());
        if (this.names) console.log("names: " + this.names.toString());
        if (this.consts) console.log("consts: " + this.consts.toString());
        if (this.freevars) console.log("freevars: " + this.freevars.toString());
        if (this.cellvars) console.log("cellvars: " + this.cellvars.toString());
        if (!this.code) throw new Error("this PyCodeObject doesnt have any code");
        if (!this.code.value) throw new Error("this PyCodeObjects code doesnt have a value");
        for (var i = 0; i < this.code.value.length; i += 3) {
            var op = this.code.value.readUInt8(i);
            console.log("\topname: " + op.toString(16) + " " + opcodes.Opcode[op]);
            if (op >= opcodes.HAVE_ARGUMENT) {
                var nextBytes = this.code.value.slice(i+1, i+2);
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
    }
}




