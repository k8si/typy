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
PyInt64
PyComplex (complex number)
PyInterned
PyStringRef
PySet
 */

import opcodes = require("./opcodes");


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
}

export class PyTrue extends PyPrimitive {
    value:boolean = true;
    constructor(offset:number) {
        super(offset, "true");
    }
}

export class PyFalse extends PyPrimitive {
    value:boolean = false;
    constructor(offset:number) {
        super(offset, "false");
    }
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
}

export class PyLong extends PyComplex {
    value:number;
    constructor(offset:number, value:number){
        super(offset, "long");
        this.value=value;
    }
}

export class PyFloat extends PyComplex {
    value:number;
    constructor(offset:number, value:number) {
        super(offset, "float");
        this.value = value;
    }
}

export class PyString extends PyComplex {
    value:Buffer;
    constructor(offset:number, value:Buffer){
        super(offset, "string");
        this.value=value;
    }
}

export class PyTuple extends PyComplex {
    value:any[];
    constructor(offset:number, value:any[]){
        super(offset, "tuple");
        this.value=value;
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
    varnames:any;
    freevars:any;
    cellvars:any;
    filename:any;
    name:any;
    firstlineno:number;
    lnotab:any;

    constructor(offset:number,
        argcount:number, nlocals:number, stacksize:number, flags:number,
        code:PyString, consts:PyTuple, names:PyTuple, varnames:any,
        freevars:any, cellvars:any, filename:any, name:any,
        firstlineno:number, lnotab:any)
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

    toString(): string {
        var info = this.argcount + " " + this.nlocals + " " + this.stacksize + " " + this.flags;
        return "PyCodeObject: " + info;
    }

    public print_co_code(): void {
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

    }
}




