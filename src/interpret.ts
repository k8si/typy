/**
 * Created by kate on 10/8/14.
 */

/** based on byterun:
 * https://github.com/nedbat/byterun/blob/master/byterun/pyvm2.py -- VirtualMachine
 * https://github.com/nedbat/byterun/blob/master/byterun/pyobj.py -- Frame
 * **/

import pyo = require('./py_objects');
import utils = require('./utils');
import opcodes = require('./opcodes');

class Frame {

    public code: pyo.PyCodeObject;
    public globals: any[];
    private locals: any[];
    private back: any;
    private stack: utils.Stack<any>;
    private lineno: number;
    public lasti: number;

    constructor(code:pyo.PyCodeObject, globals:any[], locals:any[], back:Frame){
        this.code = code;
        this.globals = globals;
        this.locals = locals;
        this.back = back;
        this.stack = new utils.Stack<any>();
        this.lineno = code.firstlineno;
        this.lasti = 0;

        //TODO cellvars?
        //TODO freevars?
    }

    public line_number(): number {
        var lnotab = this.code.lnotab;
        /* TODO ???
         byte_increments = six.iterbytes(lnotab[0::2])
         line_increments = six.iterbytes(lnotab[1::2])
         */
        var byteNum = 0;
        var lineNum = this.code.firstlineno;

        /* TODO ???
         for byte_incr, line_incr in zip(byte_increments, line_increments):
         byte_num += byte_incr
         if byte_num > self.f_lasti:
         break
         line_num += line_incr
         */

        return lineNum;
    }

}

/*
 TODO: top, pop, push, popn, peek, jump, push_block, pop_block, make_frame, push_frame, resume_frame
 run_code, unwind_block, prase_byte_and_args, dispatch ....
 */
export class Interpreter {

    private frames: utils.Stack<Frame>;
    private frame: Frame;
    private TypeMap;

    constructor(){
        this.frames = new utils.Stack<Frame>();
        this.frame = undefined;
        this.TypeMap = opcodes.TypeMap;
    }

    public interpret(obj: pyo.PyCodeObject): void {
        console.log("--> interpreter <--");
        console.log(obj.toString());
        obj.print_co_code();
    }

    private run_code(code:pyo.PyCodeObject, globals:any[]=undefined, locals:any[]=undefined): void {
        var frame = this.make_frame(code, globals, locals);


    }

    private make_frame(code:pyo.PyCodeObject, globals:any[]=undefined, locals:any[]=undefined): Frame {
        var fglobals, flocals;
        if (globals) {
            fglobals = globals;
            if (locals) flocals = fglobals;
        } else if (this.frame) {
            fglobals = this.frame.globals;
            flocals = [];
        } else {
            fglobals = flocals = ["put some stuff here"]; //TODO
        }
        //TODO f_locals.update(callargs)
        return new Frame(code, fglobals, flocals, this.frame);
    }

    private run_frame(frame:Frame): void {
        this.frames.push(frame);
        while (true) {

            break;
        }
    }

    private parse_byte_and_args(): void {
        var op_offset = this.frame.lasti;
        var frameCode = this.frame.code.code.value;
        var byteCode = frameCode.readUInt8(op_offset);
        this.frame.lasti++;
        var opName = this.TypeMap[byteCode];
        var arguments = [];
        var arg;
        if (byteCode >= 90) { //dis.HAVE_ARGUMENT = 90
//            arg = frameCode.slice(this.frame.lasti, this.frame.lasti+2);
//            this.frame.lasti += 2;
            //TODO left off on line 180 of https://github.com/nedbat/byterun/blob/master/byterun/pyvm2.py
        }
    }




}