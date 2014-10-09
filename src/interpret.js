/**
* Created by kate on 10/8/14.
*/
var utils = require('./utils');
var opcodes = require('./opcodes');

var Frame = (function () {
    function Frame(code, globals, locals, back) {
        this.code = code;
        this.globals = globals;
        this.locals = locals;
        this.back = back;
        this.stack = new utils.Stack();
        this.lineno = code.firstlineno;
        this.lasti = 0;
        //TODO cellvars?
        //TODO freevars?
    }
    Frame.prototype.line_number = function () {
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
    };
    return Frame;
})();

/*
TODO: top, pop, push, popn, peek, jump, push_block, pop_block, make_frame, push_frame, resume_frame
run_code, unwind_block, prase_byte_and_args, dispatch ....
*/
var Interpreter = (function () {
    function Interpreter() {
        this.frames = new utils.Stack();
        this.frame = undefined;
        this.TypeMap = opcodes.TypeMap;
    }
    Interpreter.prototype.interpret = function (obj) {
        console.log("--> interpreter <--");
        console.log(obj.toString());
        obj.print_co_code();
    };

    Interpreter.prototype.run_code = function (code, globals, locals) {
        if (typeof globals === "undefined") { globals = undefined; }
        if (typeof locals === "undefined") { locals = undefined; }
        var frame = this.make_frame(code, globals, locals);
    };

    Interpreter.prototype.make_frame = function (code, globals, locals) {
        if (typeof globals === "undefined") { globals = undefined; }
        if (typeof locals === "undefined") { locals = undefined; }
        var fglobals, flocals;
        if (globals) {
            fglobals = globals;
            if (locals)
                flocals = fglobals;
        } else if (this.frame) {
            fglobals = this.frame.globals;
            flocals = [];
        } else {
            fglobals = flocals = ["put some stuff here"]; //TODO
        }

        //TODO f_locals.update(callargs)
        return new Frame(code, fglobals, flocals, this.frame);
    };

    Interpreter.prototype.run_frame = function (frame) {
        this.frames.push(frame);
        while (true) {
            break;
        }
    };

    Interpreter.prototype.parse_byte_and_args = function () {
        var op_offset = this.frame.lasti;
        var frameCode = this.frame.code.code.value;
        var byteCode = frameCode.readUInt8(op_offset);
        this.frame.lasti++;
        var opName = this.TypeMap[byteCode];
        var arguments = [];
        var arg;
        if (byteCode >= 90) {
            //            arg = frameCode.slice(this.frame.lasti, this.frame.lasti+2);
            //            this.frame.lasti += 2;
            //TODO left off on line 180 of https://github.com/nedbat/byterun/blob/master/byterun/pyvm2.py
        }
    };
    return Interpreter;
})();
exports.Interpreter = Interpreter;
