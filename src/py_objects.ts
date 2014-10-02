/**
 * Created by kate on 9/28/14.
 */

/*
TODO this may all be unnecessarily complicated

TODO PyObjects for StopIter, Ellipsis, PyFloat, PyList, PySet and some others

TODO change "any"-type fields to something other than "any" (anything that's "any" is "any"
because I didn't feel like figuring it out at the time)


 */


export class APyObject { } //sigh

// abstract wrapper class for Python primitives / "simple types"
export class APyPrimitive extends APyObject {
    offset:number; type:string;
    constructor(offset:number, type:string){ super(); this.offset = offset; this.type = type; }
}

export class PyNone extends APyPrimitive {
    value:any = undefined;
    constructor(offset:number) { super(offset, "none"); }
}

export class PyTrue extends APyPrimitive {
    value:boolean = true;
    constructor(offset:number) { super(offset, "true"); }
}

export class PyFalse extends APyPrimitive {
    value:boolean = false;
    constructor(offset:number) { super(offset, "false"); }
}


// abstract wrapper class for Python "objects" / "complex types"
export class APyComplex extends APyObject {
    offset:number; type:string;
    constructor(offset:number, type:string){ super(); this.offset = offset; this.type = type; }
}

export class PyInt extends APyComplex {
    value:number;
    constructor(offset:number, value:number){ super(offset, "int"); this.value=value; }
}

export class PyLong extends APyComplex {
    value:number;
    constructor(offset:number, value:number){ super(offset, "long"); this.value=value; }
}

export class PyString extends APyComplex {
    value:Buffer;
    constructor(offset:number, value:Buffer){ super(offset, "string"); this.value=value; }
}

export class PyTuple extends APyComplex {
    value:any[];
    constructor(offset:number, value:any[]){ super(offset, "tuple"); this.value=value; }
}


export class PyCodeObject extends APyComplex {
    value:Buffer;
    argcount:number; nlocals:number; stacksize:number; flags:number;
    code:any; consts:any; names:any; varnames:any; freevars:any; cellvars:any; filename:any; name:any; firstlineno:number; lnotab:any;
    constructor(offset:number,
        argcount:number, nlocals:number, stacksize:number, flags:number,
        code:any, consts:any, names:any, varnames:any,
        freevars:any, cellvars:any, filename:any, name:any,
        firstlineno:number, lnotab:any){
        super(offset, "code_object");
        this.argcount=argcount; this.nlocals=nlocals; this.stacksize=stacksize; this.flags=flags;
        this.code=code; this.consts=consts; this.names=names; this.varnames=varnames;
        this.freevars=freevars; this.cellvars=cellvars; this.filename=filename; this.name=name;
        this.firstlineno=firstlineno; this.lnotab=lnotab;
    }
    toString(): string { return "a PyCodeObject"; }
}




