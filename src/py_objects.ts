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

    public parse_co_code(): any[] {
        var result = [];
        var buf = this.code.value;
        if (buf) {
            var i = 0;
            var thisResult = [];
            while (i < buf.length) {
//                console.log("\t OPNAME: " + buf[i].toString(16) + " " + opcodes.Opcode[buf[i]]); //+ " -- " + opcodes.BetterOpcodes[opcodes.Opcode[buf[i]]]);
                var opc_name = opcodes.Opcode[buf[i]];
                thisResult.push(opc_name);
                i++;
                if (!(opc_name in opcodes.OpsWithArgs) || i + 2 >= buf.length) break;
                var opc = opcodes.OpsWithArgs[opc_name];
                // from byterun: intArg = byteint(arg[0]) + (byteint(arg[1]) << 8)
                var nextBytes = buf.slice(i, i+2);
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

                if (argVal) thisResult.push(argVal.toString());
                result.push(thisResult);

            }

        } else throw new Error("this PyCodeObject's co_code is undefined");

        for (var k = 0; k < result.length; k++) {
            console.log(result[k]);
        }
        return result;


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

        var buf = this.code.value;

        if (buf) {
            var i = 0;
            while (i < buf.length) {
                console.log("\t OPNAME: " + buf[i].toString(16) + " " + opcodes.Opcode[buf[i]]); //+ " -- " + opcodes.BetterOpcodes[opcodes.Opcode[buf[i]]]);

                var opc_name = opcodes.Opcode[buf[i]];
                i++;

                if (!(opc_name in opcodes.OpsWithArgs) || i + 2 >= buf.length) break;

                var opc = opcodes.OpsWithArgs[opc_name];
//                var idx = buf.readInt16LE(i);
                var nextBytes = buf.slice(i, i+2);
                var idx = nextBytes[0] + (nextBytes[1] << 8);
                i += 2;

                if (opc.args == "const") {
                    console.log("\t\targ: consts @ " + idx + " : " + this.consts.get(idx));
                } else if (opc.args == "locals") {
                    console.log("\t\targ: varnames @ " + idx + " : " + this.varnames.get(idx));
                } else if (opc.args == "names") {
                    console.log("\t\targ: names @ " + idx + " : " + this.names.get(idx));
                } else if (opc.args == "jrel") {
                    console.log("\t\targ: jrel arg = lasti + " + idx );
                } else if (opc.args == "jabs") {
                    console.log("\t\targ: jabs arg = " + idx );
                } else {
                    console.log("args don't match: " + opc.args);
                }
                //TODO LOAD_CLOSURE, LOAD_DEREF, STORE_DEREF w/cellvars / freevars

            }


        } else throw new Error("this PyCodeObject's co_code is undefined");


    }
}




