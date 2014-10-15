/// <reference path="../lib/node/node.d.ts" />
/// <reference path="../typings/long/long.d.ts" />

import pyo = require("./py_objects");
import utils = require("./utils");
import opcodes = require('./opcodes');

//TODO Block class
export class Block {

}

//TODO finish Function class
export class Function {
    //attrs
    func_code: any;
    func_name: string;
    func_defaults: any[];
    func_locals: any;
    func_globals: any;
    func_dict: utils.Dict<any>;
    func_closure: any;
    __doc__: any;
    _vm: any;

    constructor(name:string, py_code:pyo.PyCodeObject, globs:any, defaults:any, closure:any, vm:any) {
        this._vm = vm;
        this.func_code = py_code;
        if (py_code.name) this.func_name = py_code.name.toString();
        else this.func_name = "???";
        this.func_defaults = [defaults];
        this.func_globals = globs;
        this.func_dict = new utils.Dict<any>();
        this.func_closure = closure;
        if (py_code.consts && (py_code.consts.value.length > 0)) this.__doc__ = py_code.consts[0];
        else this.__doc__ = undefined;

        /* TODO
         # Sometimes, we need a real Python function.  This is for that.
         kw = {
         'argdefs': self.func_defaults,
         }
         if closure:
         kw['closure'] = tuple(make_cell(0) for _ in closure)
         self._func = types.FunctionType(code, globs, **kw)
         */
    }

    public toString(){ return "<Function " + this.func_name +">";}

    //TODO should be return Method...
    public __get__(instance: any, owner: any): any { return this; }
    public __call__(a:any[], args?:any[], kwargs?:utils.Dict<any>): any {
        if (a.length != this.func_code.argcount) throw new Error("FUNCTION ERR");
        //TODO if PY2
        var callargs = new utils.Dict<any>();
        callargs.add('a', a);
        callargs.add('args', args);
        callargs.add('kwargs', kwargs);
        var frame = this._vm.make_frame(this.func_code, callargs, this.func_globals, new utils.Dict<any>());

        //TODO generator stuff:
        var CO_GENERATOR = 32;
        var retval;
        if (this.func_code.flags & CO_GENERATOR) {
            retval = undefined;
        } else {
            retval = this._vm.run_frame(frame);
        }

        return retval;
    }
}



//TODO test everything
export var UNARY_OPS = {
    POSITIVE: function(arg: number) { return Math.abs(arg); },
    NEGATIVE: function(arg: number) { return -1*Math.abs(arg); },
    NOT: function(arg: any) { return !arg; },
    CONVERT: function(arg: any) { return arg.toString(); },
    INVERT: function(arg: any) { return arg; } //TODO
};

//TODO finish these / everything
export var BINARY_OPS = {
    POWER: Math.pow,
    ADD: function(x, y){ return x + y; },
    //TODO rest
    SUBTRACT: function(x, y){ return x - y; }
    //...
};

//TODO
export var COMPARE_OPS = {

};


export class Frame {
    frame_code_object: pyo.PyCodeObject;
    globals: utils.Dict<any>;//any; // TODO should be Dict ?
    locals: utils.Dict<any>; //any; // TODO should be Dict ?
    back: Frame;
    stack: any[]; //TODO a stack of what?
    builtins: any[];
    lineno: number;
    lasti: number;
    cells: utils.Dict<any>;
    block_stack: Block[];
    generator:any;

    constructor(code, globals:utils.Dict<any>, locals:utils.Dict<any>, back){
        this.frame_code_object = code; this.globals = globals; this.locals = locals; this.back = back;
        if (back) this.builtins = back.builtins;
        //TODO else { this.builtins = locals['__builtins__'] ...} (byterun/pyobj.py line 147)
        this.lineno = code.firstlineno;
        this.lasti = 0;
        //TODO: (byterun line 154)
        if (code.cellvars) {
//            this.cells = new utils.Dict<any>();
//            if (!back.cells) back.cells = new utils.Dict<any>();
//            //...
        }
        if (code.freevars) {
            //TODO
        }
        this.block_stack = [];
        this.stack = [];
        this.generator = new pyo.PyNone(-1);
    }
    public toString(): string { return "<Frame " + this.frame_code_object.filename + " " + this.lineno; }
    public lineNumber(): number {
        var lnotab = this.frame_code_object.lnotab;
        var byte_increments = [];
        for (var i = 0; i < lnotab.length; i += 2) byte_increments.push(lnotab[i]);
        var line_increments = [];
        for (var i = 1; i < lnotab.length; i += 2) line_increments.push(lnotab[i]);
        //hopefully they are the same length...
        var byteNum = 0; var lineNum = this.frame_code_object.firstlineno;
        for (var i = 0; i < byte_increments.length; i += 1) {
            byteNum += byte_increments[i];
            if (byteNum > this.lasti) break;
            lineNum += line_increments[i];
        }
        return lineNum;
    }
}

export class VirtualMachine {
    private frames: Frame[];
    private frame: Frame;
    private returnval: any;
    private ERR = "VM ERROR";
    private TAG = "VirtualMachine:";

    constructor(){ this.frames = []; }

    private top(): any { return this.frame.stack[this.frame.stack.length - 1]; }
    private pop(): any { return this.frame.stack.pop(); }
    private push(val: any): void { this.frame.stack.push(val); }
    private popn(n: number): Array<any> {
        console.assert(n < this.frame.stack.length, "ArrayIndex out of bounds");
        var result = [];
        for (var i = 0; i < n; i++) result.push(this.frame.stack.pop());
        return result;
    }
    //TODO public peek(i:number)
    /** move the bytecode pointer to 'jump', so it will execute next **/
    private jump(jump:number): void { this.frame.lasti = jump; }

    private pushBlock(type:any, handler?:any, level?:any): void {
        if (!level) level = this.frame.stack.length;
//       this.frame.block_stack.push(Block(type, handler, l))  //TODO (byterun/pyvm2.py line 85)
    }

    private popBlock(): Block { return this.frame.block_stack.pop(); }
    //TODO pop_block()
    private make_frame(code:pyo.PyCodeObject, callargs=new utils.Dict<any>(), globals?:any, locals?:any): Frame {
        console.log("make frame: " + code.toString());
        var frame_globals, frame_locals;
        if (globals) {
            frame_globals = globals;
            if (locals) frame_locals = globals;
        } else if (this.frame) { //TODO "if (this.frame)" instead of this.frames?? bug in byterun??
            frame_globals = this.frame.globals;
            frame_locals = new utils.Dict<any>();
        } else {
            frame_globals = new utils.Dict<any>();
            frame_globals.add("__builtins__", "NOTYETIMPLEMENTED");
            frame_globals.add("__name__", "__main__");
            frame_globals.add("__doc__", undefined);
            frame_globals.add("__package__", undefined);
            frame_locals = frame_globals;
        }
        frame_locals.update(callargs);
        var frame = new Frame(code, frame_globals, frame_locals, this.frame);
        return frame;
    }

    //TODO push_frame
    private push_frame(frame:Frame): void { this.frames.push(frame);  this.frame = frame; }
    private pop_frame(): void {
        this.frames.pop();
        if (this.frames.length > 0) this.frame = this.frames[this.frames.length-1];
        else this.frame = undefined;
    }
    //TODO print_frames
    //TODO resume_frame

    public run_code(code:pyo.PyCodeObject, globals?:any, locals?:any): any {
        var frame = this.make_frame(code, globals, locals);
        var val = this.run_frame(frame);
        if (this.frames.length > 0) throw new Error(this.ERR);
        if (this.frame && this.frame.stack.length > 0) throw new Error(this.ERR);
        return val
    }

    private run_frame(frame:Frame): any {
        var INFO = this.TAG + " run_frame: ";
        this.push_frame(frame);
        while (true) {
            var byteinfo = this.parse_byte_and_args();
            if (byteinfo.length != 3) throw new Error(this.ERR + ": byteinfo.length != 3 -- " + byteinfo.toString());
            console.log(INFO + " doing " + byteinfo.toString());
            var byteName = byteinfo[0]; var args = byteinfo[1]; var offset = byteinfo[2];
            if (args && args.length == 0) args = undefined;
            var why = this.dispatch(byteName, args);
            //TODO if why == 'exception', reraise
//            if (why != "yield") {
//                while(why && frame.block_stack) {
//                    why = this.manage_block_stack(why);
//                }
//            }
            if (why) break;
        }
        this.pop_frame();
        //TODO handle exceptions
        return this.returnval;
    }

    /**
     *
     * @returns {Array} = [opcode_name, args, offset]
     */
    private parse_byte_and_args(): any[] {
        var result = [];
        var f = this.frame;
        var offset = f.lasti;
        var byteInfo = f.frame_code_object.get_byteinfo_at(offset);
        if (byteInfo.length == 0) throw new Error(this.ERR);
        f.lasti++;
        var byteName = byteInfo[0];
        result.push(byteName);
        var arg;
        if (byteInfo.length >= 1) {
            arg = byteInfo[1]; result.push(arg);
            f.lasti += 2;
        } else result.push("");
        result.push(offset);

//        console.log("opname="+byteName+", arg="+arg+", offset="+offset);
//        var s = this.TAG + " parse_byte_and_args(): ";
//        if (result.length == 3) console.log(s + " " + result.toString());
//        else {
//            console.log(s + " result len=" + result.length + " " + result.toString());
//            throw new Error(this.ERR);
//        }

        return result;
    }

    //TODO
    private manage_block_stack(why:string): string {
        return undefined;
//        if (why == "yield") throw new Error(this.ERR);
//        var block = this.frame.block_stack[this.frame.block_stack.length-1];
//        //TODO if block.type == loop ....
//        this.popBlock();
//        //TODO this.unwind_block(block)
//        //TODO everything else...
//        why = "yield";
//        return why;
    }

    private dispatch(byteName:string, args:any): any {
        var INFO = this.TAG + " run_frame: ";
        var why;
        var unaryOp, binaryOp, inplaceOp, sliceOp;
        if (byteName.search(/UNARY_/) == 0) this.unaryOperator(byteName.slice(6, byteName.length));
        else if (byteName.search(/BINARY_/) == 0) this.binaryOperator(byteName.slice(7, byteName.length));
        else if (byteName.search(/INPLACE_/) == 0) this.inplaceOperator(byteName.slice(8, byteName.length));
        else if (byteName.search(/SLICE/) != -1) this.sliceOperator(byteName);
        else {
            why = this.getOp(byteName, args);
//            var bytecode_fn = this.getOp(byteName);
//            if (!bytecode_fn) throw new Error(this.ERR);
//            why = bytecode_fn(args);
        }
        return why;
    }

    private unaryOperator(op:string): void {
        var x = this.pop();
        this.push(UNARY_OPS[op](x));
    }

    private binaryOperator(op:string): void {
        var x = this.pop();
        var y = this.pop();
        this.push(BINARY_OPS[op](x, y));
    }

    private inplaceOperator(op:string): void {
        var x = this.pop();
        var y = this.pop();
        if (op == "POWER") x = Math.pow(x, y);
        else if (op == "MULTIPLY") x = x * y;
        else if (op == "DIVIDE") x = x / y;
        else throw new Error(this.ERR);
        //TODO the rest of these
    }

    //TODO verify this works
    private sliceOperator(op:string): void {
        var start = 0;
        var end;
        var op = op.slice(0, op.length-2);
        var count = parseInt(op[op.length-1]);
        switch (count) {
            case 1:
                start = this.pop();
                break;
            case 2:
                end = this.pop();
                break;
            case 3:
                end = this.pop();
                start = this.pop();
                break;
            default:
                throw new Error(this.ERR);
                break;
        }
        var l = this.pop();
        if (!end) end = l.length;
        if (op.search(/STORE/) == 0) {
            //TODO not sure if this does what I think it should
            var res = this.pop();
            var pre = l.slice(0, start);
            var post = l.slice(end, l.length);
            l = pre.concat(res).concat(post);
        } else if (op.search(/DELETE/) == 0) {
            var pre = l.slice(0, start); var post = l.slice(end, l.length);
            l = l.concat(pre).concat(post);
        } else this.push(l.slice(start, end));
    }

    private getOp(op:string, args?:any): any {
        if (op == "LOAD_CONST") this.LOAD_CONST(args);
        if (op == "STORE_NAME") this.STORE_NAME(args);
        if (op == "LOAD_NAME") this.LOAD_NAME(args);
        if (op == "POP_TOP") { console.log("\tPOP_TOP"); this.pop(); }
        if (op == "ROT_TWO") this.ROT_TWO();
        if (op == "MAKE_FUNCTION") this.MAKE_FUNCTION(args);
        if (op == "RETURN_VALUE") return this.RETURN_VALUE();
        return undefined;
    }

    private LOAD_CONST(c:any): void { console.log("\tLOAD_CONST " + c.toString()); this.push(c); }

    private STORE_NAME(n:pyo.PyInterned): void {
        console.log("\tSTORE_NAME " + n.toString());
        this.frame.locals.add(n.value.toString(), this.pop());
    }

    private LOAD_NAME(n:pyo.PyInterned): void {
        console.log("\tLOAD_NAME " + n.toString());
        var frame = this.frame;
        var name = n.value.toString();
        var val;
        if (frame.locals.contains(name)) val = frame.locals.get(name);
        else if (frame.globals.contains(name)) val = frame.globals.get(name);
//TODO        else if (frame.builtins.contains(n)) val = frame.builtins.get(n);
        else throw new Error(this.ERR + " LOAD_NAME on " + n.toString());
        if (val) this.push(val);
    }

    private ROT_TWO(): void {
        console.log("\tROT_TWO");
        var a = this.pop();
        var b = this.pop();
        this.push(b);
        this.push(a);
    }

    private RETURN_VALUE(): string {
        this.returnval = this.pop();
        console.log("\tRETURN_VALUE " + this.returnval.toString());
        //TODO if self.frame.generator
        return "return";
    }

    private MAKE_FUNCTION(arg:any): void {
//        if (!arg) throw new Error(this.ERR + " MAKE_FUNCTION: no arg??");
        console.log("\tMAKE_FUNCTION"); //+ arg.toString());
        var code = this.pop();
        var defaults = [];
        for (var i = 0; i < arg; i++) {
            defaults.push(this.pop());
        }
        var globs = this.frame.globals;
        var fn = new Function("", code, globs, defaults, undefined, this);
        this.push(fn);
    }

    private STORE_MAP(): void {

    }
}