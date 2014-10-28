/// <reference path="lib/node/node.d.ts" />
/// <reference path="typings/long/long.d.ts" />

import pyo = require("./py_objects");
import utils = require("./utils");
import opcodes = require('./opcodes');
import vmo = require('./vm_objects');
import bi = require('./builtins');


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
    SUBTRACT: function(x, y){ return x - y; },
    MULTIPLY: function(x,y){ return x * y; },
    DIVIDE: function(x,y){return x / y ;},
    SUBSCR: function(x, y){
        console.log("\t" + x.toString() + " get " + y.toString());
        var val = x.get(y);
        if (val) { console.log("\t got " + val.toString()); return val; }
        else throw new Error("BINARY_SUBSCR: key error");
    }

};

/** status code for main loop (reason for stack unwind) **/
export enum WHY {
    NONE = 0x0001, //no error
    EXCEPTION = 0x0002, //exception occurred
    RERAISE = 0x0004, //exception re-raised by 'finally'
    RETURN = 0x008, //return statement
    BREAK = 0x0010, //break statement
    CONTINUE = 0x0020, //continue statement
    YIELD = 0x0040 //yield operator
}

export class VirtualMachine {
    private frames: vmo.Frame[]; //call stack of frames
    private frame: vmo.Frame; //the current frame
    private returnval: any;
    private ERR = "VM ERROR";
    private TAG = "VirtualMachine:";
    private last_exception: any[];
    private stdout: string[];
    private opLog: string[];

    constructor(){ this.frames = []; this.stdout = []; this.opLog = []; }

    private raise_error(msg:string): void {
        console.log(this.ERR + " " + msg);

        this.frame.frame_code_object.print_co_code();

        console.log("CURRENT FRAME STACK:");
        this.frame.print_stack();
        throw new Error(this.ERR + " " + msg)
    }

    private print(s:string): void { this.stdout.push(s); }

    private top(): any {
        if (this.frame.stack.length == 0) this.raise_error("top(): frame stack empty.");
        return this.frame.stack[this.frame.stack.length - 1];
    }

    /** pop the top frame off the call stack **/
    private pop(): any {
        if (this.frame.stack.length == 0) this.raise_error("pop(): frame stack empty.");
        return this.frame.stack.pop();
    }

    /** push a frame onto the top of the call stack **/
    private push(val: any): void { this.frame.stack.push(val); }

    private popn(n: number): Array<any> {
        if (n >= this.frame.stack.length) this.raise_error("popn: n="+n+" frame stack index out of bounds");
        var result = [];
        for (var i = 0; i < n; i++) result.push(this.frame.stack.pop());
        return result;
    }

    //TODO public peek(i:number)

    /** move the bytecode pointer to 'jump', so it will execute next **/
    private jump(jump:number): void { this.frame.lasti = jump; }

    private push_block(type:any, handler?:any, level?:any): void {
        if (!level) level = this.frame.stack.length;
        var block = new vmo.Block(type, handler, level);
        console.log("push_block(): " + block.toString());
        this.frame.block_stack.push(block);
    }

    private pop_block(): vmo.Block {
        if (this.frame.block_stack.length == 0) this.raise_error("pop_block(): no more blocks to pop.");
        return this.frame.block_stack.pop();
    }

    private make_frame(code:pyo.PyCodeObject, callargs=new pyo.PyDict(), globals?:any, locals?:any): vmo.Frame {
        console.log("make frame: " + code.toString());
        var frame_globals, frame_locals;
        if (globals) {
            frame_globals = globals;
            if (!locals) frame_locals = globals;
        } else if (this.frame) { //TODO "if (this.frame)" instead of this.frames?? bug in byterun??
            frame_globals = this.frame.globals;
            frame_locals = new pyo.PyDict();
        } else {
            frame_globals = new pyo.PyDict();
            frame_globals.add("__builtins__", bi.builtins);
            frame_globals.add("__name__", new pyo.PyString(new Buffer("__main__")));
            frame_globals.add("__doc__", new pyo.PyNone());
            frame_globals.add("__package__", new pyo.PyNone());
            frame_locals = frame_globals;
        }
        frame_locals.update(callargs);
        var frame = new vmo.Frame(code, frame_globals, frame_locals, this.frame);
        return frame;
    }

    //TODO push_frame
    private push_frame(frame:vmo.Frame): void { this.frames.push(frame);  this.frame = frame; }

    private pop_frame(): void {
        this.frames.pop();
        if (this.frames.length > 0) this.frame = this.frames[this.frames.length-1];
        else this.frame = undefined;
    }
    //TODO print_frames
    //TODO resume_frame

    public run_code(code:pyo.PyCodeObject, globals?:any, locals?:any): any {
        console.log("running code...");
        var frame = this.make_frame(code, globals, locals);

        var val = this.run_frame(frame);
        if (this.frames.length > 0) throw new Error(this.ERR);
        if (this.frame && this.frame.stack.length > 0) throw new Error(this.ERR);
        console.log("done.");

        var outString = "";
        for (var i = 0; i < this.stdout.length; i++) outString += " >> " + this.stdout[i] + " <br>";
        console.log("RESULTS: " + outString);
        document.getElementById("output").innerHTML += "<br>" + outString;
        return val
    }

    private run_frame(frame:vmo.Frame): any {
        console.log("running frame...");
        this.push_frame(frame);

        while (true) {
            var byteinfo = this.parse_byte_and_args();
            if (byteinfo.length < 3) throw new Error(this.ERR + ": byteinfo.length < 3 -- " + byteinfo.toString());
//            console.log(INFO + " doing " + byteinfo.toString());
            var byteName = byteinfo[0];
            var byteCode = byteinfo[1];
            var offset = byteinfo[2];
            var arg;
            if (byteinfo.length > 3) arg = byteinfo[3];
            var why = this.dispatch(byteName, byteCode, arg);
            if (why == WHY.EXCEPTION) console.log("run_frame(): why == exception (TODO)");
            if (why == WHY.RERAISE) why = WHY.EXCEPTION;

            //TODO what the hell is going on here
            if (why != WHY.YIELD) {
                //TODO in byterun this is while (why && frame.block_stack) but I don't know why frame.block_stack would disappear?
                while (why && frame.block_stack.length > 0) why = this.manage_block_stack(why);
            }
            if (why) break;
        }

        this.pop_frame();

        if (why == WHY.EXCEPTION) this.raise_error("run_frame(): why == exception: info: " + this.last_exception.toString());

        return this.returnval;
    }


    private dispatch(byteName:string, byteCode:number, arg?:any): number {
//        console.log("dispatch(): " + byteName + " " + byteCode + " " + arg);
//        console.log("\n - - - - - - - - - - ");
//        console.log("dispatch(): CURRENT FRAME STACK:");
//        this.frame.print_stack();
//        console.log(" - - - - - - - - - - \n");
        this.opLog.push(byteName);
//        console.log("ops so far including this one: " + this.opLog);
        var why;
        if (byteName.search(/UNARY_/) == 0) this.unaryOperator(byteName.slice(6, byteName.length));
        else if (byteName.search(/BINARY_/) == 0) this.binaryOperator(byteName.slice(7, byteName.length));
        else if (byteName.search(/INPLACE_/) == 0) this.inplaceOperator(byteName.slice(8, byteName.length));
        else if (byteName.search(/SLICE/) != -1) this.sliceOperator(byteName);
        else why = this.getOp(byteCode, arg);
        return why;
    }

    /**
     *
     *
     * @returns {Array} = [opcode_name, opcode_number, offset, arg if there is one]
     */
    private parse_byte_and_args(): any[] {
        var results = [];
        var f = this.frame;
        var byteCodeBuff: Buffer = f.frame_code_object.code.value; //toBuffer();
        var op_offset = f.lasti;
        var op_code: number = byteCodeBuff.readUInt8(op_offset);
        f.lasti++;
        var op_name: string = opcodes.Opcode[op_code.toString()];
        results.push(op_name);
        results.push(op_code);
        results.push(op_offset);
        var arg;
        if (op_code >= opcodes.HAVE_ARGUMENT) {
            var a1 = byteCodeBuff.readUInt8(f.lasti), a2 = byteCodeBuff.readUInt8(f.lasti+1);
            var intArg = a1 + (a2 << 8);
//            var intArg = utils.read_short(byteCodeBuff, f.lasti);
            f.lasti += 2;
            if (utils.contains(opcodes.hasArgInConsts, op_code)) {
                if (f.frame_code_object.consts.type == "stopiter") arg = f.frame_code_object.consts;
                else arg = f.frame_code_object.consts.get(intArg);
            } else if (utils.contains(opcodes.hasArgInNames, op_code)) {
                arg = f.frame_code_object.names.get(intArg);
            } else if (utils.contains(opcodes.hasJrel, op_code)) {
                arg = f.lasti + intArg;
            } else if (utils.contains(opcodes.hasJabs, op_code)) {
                arg = intArg;
            } else if (utils.contains(opcodes.hasArgInLocals, op_code)) {
                arg = f.frame_code_object.varnames.get(intArg);
            } else if (utils.contains(opcodes.hasFree, op_code)) {
                this.raise_error("parse_byte_and_args(): args in FREE not yet implemented.");
            } else {
                arg = intArg;
            }
            if (arg) results.push(arg);
        }
        return results;
    }

    /*** manage a frame's block stack. manipulate the block stack and data stack for looping, exception handling
     * returning, weird stuff like that **/
    private manage_block_stack(why:number): number {
        var TAG = " manage_block_stack(): ";

        if (why == WHY.YIELD) throw new Error(this.ERR + TAG + " why == yield at start");
        if (this.frame.block_stack.length == 0) throw new Error(this.ERR + TAG + " no blocks left to manage?");

        var block = this.frame.block_stack[this.frame.block_stack.length - 1]; //pop the last thing off the current frame's block stack

        if (block.type == "loop" && why == WHY.CONTINUE) {
            this.jump(this.returnval);
            return WHY.NONE;
        }

        this.pop_block();
        this.unwind_block(block);

        if (block.type == "loop" && why == WHY.BREAK) {
            this.jump(block.handler);
            return WHY.NONE;
        }

        //byterun: if PY2 ...
        if (block.type = "finally" || (block.type == "setup-except" && why == WHY.EXCEPTION) || block.type == "with") {
            if (why == WHY.EXCEPTION) {
                var etype = this.last_exception[0], value = this.last_exception[1], tb = this.last_exception[2];
                this.push(tb); this.push(value); this.push(etype);
            } else {
                if (why == WHY.RETURN || why == WHY.CONTINUE) this.push(this.returnval);
                this.push(why);
            }
            why = WHY.NONE;
            this.jump(block.handler);
            return why;
        }

        return why; //TODO not sure why this would by anything other than WHY.NONE at this point?
    }

    private unwind_block(block:vmo.Block): void {
        var offset;
        if (block.type == "except-handler") offset = 3;
        else offset = 0;
        while (this.frame.stack.length > block.level + offset) this.pop();
        if (block.type == "except-handler") {
            var tb = this.pop();
            var value = this.pop();
            var exceptionType = this.pop();
            this.last_exception = [exceptionType, value, tb];
        }
    }


    private unaryOperator(op:string): void {
        console.log("UNARY_"+op);
        var x = this.pop();
        this.push(UNARY_OPS[op](x.value));
    }

    private binaryOperator(op:string): void {
        console.log("BINARY_"+op);
        var y = this.pop();
        var x = this.pop();
        this.push(BINARY_OPS[op](x.value, y.value));
    }

    private inplaceOperator(op:string): void {
        console.log("BINARY_"+op);
        var x = this.pop();
        var y = this.pop();
        if (typeof x == "object") x = x.value;
        if (typeof y == "object") y = y.value;
        if (op == "POWER") x = Math.pow(x, y);
        else if (op == "MULTIPLY") x = x * y;
        else if (op == "DIVIDE") x = x / y;
        else if (op == "ADD") {
            var s = "INPLACE_ADD: " + x + " + " + y + " -> ";
            x = x + y;
            s += x;
            console.log(s);
        }
        else throw new Error(this.ERR);
        this.push(new pyo.PyInt(x));
        //TODO the rest of these
    }

    //TODO verify this works
    private sliceOperator(op:string): void {
        console.log("SLICE_"+op);
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
//                break;
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

//    private fast_block_end(why:number): void {
//        console.log("fast_block_end...");
//        while (why != WHY.NONE && this.frame.block_stack.length > 0) {
//            var block = this.pop_block();
//            //assert(why != WHY.YIELD)
//            if (block.type == "setup-loop" && why == WHY.CONTINUE) {//
//            }
//        }
//    }

    private getOp(opcode:number, arg?:any): number {
        var result;
        switch (opcode) {
            case opcodes.Opcode.LOAD_CONST: this.LOAD_CONST(arg); break;
            case opcodes.Opcode.LOAD_ATTR: this.LOAD_ATTR(arg); break;
            case opcodes.Opcode.STORE_NAME: this.STORE_NAME(arg); break;
            case opcodes.Opcode.LOAD_NAME: this.LOAD_NAME(arg); break;

            case opcodes.Opcode.POP_TOP: this.pop(); break;
            case opcodes.Opcode.DUP_TOP: this.DUP_TOP(); break;
            case opcodes.Opcode.ROT_TWO: this.ROT_TWO(); break;
            case opcodes.Opcode.ROT_THREE: this.ROT_THREE(); break;
            case opcodes.Opcode.STORE_SUBSCR: this.STORE_SUBSCR(); break;

            case opcodes.Opcode.MAKE_FUNCTION: this.MAKE_FUNCTION(arg); break;
            case opcodes.Opcode.CALL_FUNCTION: this.CALL_FUNCTION(arg); break;
            case opcodes.Opcode.SETUP_LOOP: this.SETUP_LOOP(arg); break;
            case opcodes.Opcode.RETURN_VALUE: result = this.RETURN_VALUE(); break;

            case opcodes.Opcode.BUILD_LIST: this.BUILD_LIST(arg); break;
            case opcodes.Opcode.BUILD_MAP: this.BUILD_MAP(arg); break;

            case opcodes.Opcode.GET_ITER: this.GET_ITER(); break;
            case opcodes.Opcode.FOR_ITER: this.FOR_ITER(arg); break;

            case opcodes.Opcode.POP_BLOCK: this.pop_block(); break;

            case opcodes.Opcode.COMPARE_OP: this.COMPARE_OP(arg); break;

            case opcodes.Opcode.JUMP_FORWARD: this.JUMP_FORWARD(arg); break;
            case opcodes.Opcode.POP_JUMP_IF_FALSE: this.POP_JUMP_IF_FALSE(arg); break;
            case opcodes.Opcode.JUMP_ABSOLUTE: this.JUMP_ABSOLUTE(arg); break;

            case opcodes.Opcode.PRINT_ITEM:
                var item = this.pop();
                console.log("PRINT_ITEM: " + item.toString());
                this.print(item.toString());
                break;
            case opcodes.Opcode.PRINT_NEWLINE:
                console.log("PRINT_NEWLINE");
                this.print("");
                break;

            default: this.raise_error("getOp(): unknown opcode: " + opcode);
        }
        return result;
    }

    //TODO
    private LOAD_ATTR(attr: any): void {
        var obj = this.pop();
        var aval = attr.value;
        var val;
        if (obj.contains(aval)) val = obj.get(attr.value);
        else val = obj.getAttr(attr.value);
        console.log("LOAD_ATTR: " + obj.toString() + " arg: " + attr.toString() + " attr="+val.toString());
        this.push(val);
    }

    private LOAD_CONST(constant:any): void {
        console.log("LOAD_CONST " + constant.toString());
//        console.log(this.frame.frame_code_object.consts.toString());
//        this.frame.print_stack();
        this.push(constant);
    }

    private STORE_NAME(n:pyo.PyInterned): void {
        var val = this.pop();
        console.log("STORE_NAME : assign this.frame.locals.[" + n.value.toString() + "] = " + val.toString());
        this.frame.locals.add(n.value.toString(), val);
//        console.log(this.frame.locals.toString());
    }

    private LOAD_NAME(n:pyo.PyInterned): void {
//        console.log("\tLOAD_NAME " + n.toString());
        var frame = this.frame;
        var name = n.value;
        var val;
        if (frame.locals.contains(name)) {
            val = frame.locals.get(name);
            console.log("LOAD_NAME : load this.frame.locals[" + n.value.toString() + "] = " + val.toString());
//            console.log(this.frame.locals.toString());
        }
        else if (frame.globals.contains(name)){
            val = frame.globals.get(name);
        }
        else if (name in bi.builtins){
            console.log("LOAD_NAME : load builtins[" + n.value.toString() + "]");
            val = bi[name];
        }

        else this.raise_error(" LOAD_NAME on " + n.toString());

        this.push(val);
    }

    private ROT_TWO(): void {
        console.log("\tROT_TWO");
        var a = this.pop();
        var b = this.pop();
        this.push(b);
        this.push(a);
    }

    private ROT_THREE(): void{
        console.log("\tROT_THREE");
        var a=this.pop();
        var b = this.pop();
        var c= this.pop();
        var top3 = [a, b, c];
        console.log(top3);
        this.push(c);
        this.push(b);
        this.push(a);
    }

    private DUP_TOP() : void{
        this.push(this.top());
    }

    private STORE_SUBSCR(): void {
        var subscr = this.pop();
        var obj = this.pop();
        var val = this.pop();
        console.log("STORE_SUBSCR : obj = " + obj.toString() + ", subscr = " + subscr.toString() + ", val = " + val.toString());
        obj.add(subscr.value, val);
        console.log("\t" + obj.toString());

    }

    private RETURN_VALUE(): number {
        this.returnval = this.pop();
        console.log("\tRETURN_VALUE " + this.returnval.toString());
        //TODO if self.frame.generator
        //CPython: goto fast_block_end;
        return WHY.RETURN;
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
        var fn = new vmo.Function("", code, globs, defaults, undefined, this);
        this.push(fn);
    }

    //TODO
    private CALL_FUNCTION(arg: any): void {
        console.log("CALL_FUNCTION: arg = " + arg.toString());
        var args = new pyo.PyList();
        var kwargs = new pyo.PyDict();
        this.call_function(arg, args, kwargs);
//        //TODO args, kwargs
//        var fxn = this.pop();
//        console.log("\t"+fxn.toString());
//        var result = fxn();
//        console.log("\tresult: " + result.toString());

    }

    private divmod(a: number, b: number): number[] {
        var res1 = Math.floor(a / b);
        var res2 = a % b;
        return [res1, res2];
    }

    private call_function(arg, args, kwargs): void {
        var info = "\tcall_function: ";
        var lens = this.divmod(arg, 256);
        var lenKw = lens[0], lenPos = lens[1];
        var namedArgs = new utils.Dict<any>();
        for (var i = 0; i < lenKw; i++){
            var key = this.pop();
            var val = this.pop();
            namedArgs.add(key, val);
        }
        namedArgs.update(kwargs);
        var posArgs = [];
        for (var i = 0; i < lenPos; i++){
            posArgs[i] = this.pop();
        }
        posArgs.reverse();
        for (var i = 0; i < args.length; i++) posArgs.push(args[i]);
        var fxn = this.pop();
        console.log(info + fxn.toString());
        var result = fxn.call(posArgs, namedArgs);
        info += "result: " + result.toString();
        console.log(info);
        this.push(result);
    }

    private COMPARE_OP(arg:any): void {
        var y = this.pop();
        var x = this.pop();
        var result;
        if (typeof arg == "object") arg = arg.value;
        switch (arg) {
            case 0:
                result = x.value < y.value;
                console.log("COMPARE_OP: " + arg.toString() + " " + x.toString() + " < " + y.toString() + " => " + result);
                break;
            case 1:
                result = x.value <= y.value;
                console.log("COMPARE_OP: " + arg.toString() + " " + x.toString() + " <= " + y.toString() + " => " + result);
                break;
            case 2:
                result = x.value == y.value;
                console.log("COMPARE_OP: " + arg.toString() + " " + x.toString() + " == " + y.toString() + " => " + result);
                break;
            case 3:
                result = x.value != y.value;
                console.log("COMPARE_OP: " + arg.toString() + " " + x.toString() + " != " + y.toString() + " => " + result);
                break;
            case 4:
                result = x.value > y.value;
                console.log("COMPARE_OP: " + arg.toString() + " " + x.toString() + " > " + y.toString() + " => " + result);
                break;
            case 5:
                result = x.value >= y.value;
                console.log("COMPARE_OP: " + arg.toString() + " " + x.toString() + " >= " + y.toString() + " => " + result);
                break;
            default:
//                console.log("\tCOMPARE_OP: NOT YET IMPLEMENTED: " + arg.toString() + " " + x.toString() + " ??? " + y.toString());
                this.raise_error("COMPARE_OP: NOT YET IMPLEMENTED: " + arg.toString() + " " + x.toString() + " ??? " + y.toString());
                break;
            //TODO case 6: x IS y; case 7: x IS NOT y; default: goto slow_compare
        }

        this.push(result);
    }

    private JUMP_FORWARD(jump:number): void {
        console.log("JUMP_FORWARD " + this.frame.lasti + " --> " + this.frame.lasti+jump);
        this.jump(jump);
    }

    private JUMP_ABSOLUTE(jump:number): void {
        console.log("JUMP_ABSOLUTE " + this.frame.lasti + " --> " + jump);
        this.jump(jump);
    }

    private POP_JUMP_IF_FALSE(jump:any): void {
        var val = this.pop();
        if (val == undefined) this.raise_error("POP_JUMP_IF_FALSE: val is undefined");
        console.log("POP_JUMP_IF_FALSE: val = " + val.toString());
        if (val == false) this.jump(jump);
    }

    private SETUP_LOOP(dest:number): void {
        console.log("SETUP_LOOP: dest = " + dest.toString());
        this.push_block("loop", dest);
    }

    private BUILD_LIST(numItems:number): void {
        var items = [];
        for (var i = 0; i < numItems; i++) {
            items.push(this.pop());
        }
        items = items.reverse();
        console.log("BUILD_LIST: with " + numItems + " items.");
        console.log("\tdata: " + items);
        this.push(new pyo.PyList(items));
    }

    private BUILD_MAP(numItems: number): void {
        console.log("BUILD_MAP: with " + numItems + " items.");
        this.push(new pyo.PyDict());
    }

    private GET_ITER(): void {
        var l = this.pop();
        console.log("GET_ITER for " + l.toString());
        var iter = new vmo.ListIterator(l);
        this.push(iter);
    }

    private FOR_ITER(jump: number): void {
        console.log("FOR_ITER");
        var iter = this.top();
        var v;
        if (iter.hasNext()) {
            v = iter.next();
            this.push(v);
        } else {
            this.pop();
            this.jump(jump);
        }


    }
}