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
    value:any = undefined;
    constructor(offset:number) {
        super(offset, "null")
    }
}

export class PyNone extends PyPrimitive {
    value:any = undefined;
    constructor(offset:number) {
        super(offset, "none");
    }
    public toString(): string { return "< PyNone >"; }

}

export class PyStopIter extends PyPrimitive { constructor(offset: number) { super(offset, "stopiter"); } }

export class PyEllipsis extends PyPrimitive { constructor(offset: number) { super(offset, "ellipsis"); } }

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
                else info = info + " [??] ";
                info = info + ", ";
            }
        }
        return " <PyTuple with "+this.value.length+" elements: ( " + info + " ) >"
    }
    public length(): number { return this.value.length; }
}

export class PyList extends PyComplex {
    value:any[];
    constructor(offset:number, value:any[]){
        super(offset, "list");
        this.value = value;
    }
}

export class PyDict extends PyComplex {
    value:any;
    constructor(offset:number, value:any) {
        super(offset, "dict");
        this.value = value;
    }
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
    freevars:PyTuple;
    cellvars:PyTuple;
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


    public print_co_code(): void {
        console.log("--> CO_CODE <--");
        if (this.firstlineno) console.log("firstlineno: " + this.firstlineno);
        if (this.lnotab) console.log("lnotab: " + this.lnotab.toString());
        if (this.varnames) console.log("varnames: " + this.varnames.toString());
        if (this.consts) console.log("consts: " + this.consts.toString());
        if (this.freevars) console.log("freevars: " + this.freevars.toString());
        if (this.cellvars) console.log("cellvars: " + this.cellvars.toString());

        var buf = this.code.value;
        if (buf != undefined) {
            for (var i = 0; i < buf.length; i += 3) {
                console.log("\t" + buf[i].toString(16) + " -- " + opcodes.Opcode[buf[i]]);
                console.log("\t" + buf[i + 1]);
                console.log("\t" + buf[i + 2]);
            }

        } else {
            console.log("PyCodeObject's co_code is undefined.");
            throw new Error("this PyCodeObject's co_code is undefined");
        }

    }
}




