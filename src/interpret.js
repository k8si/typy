/// <reference path="../lib/node/node.d.ts" />
/// <reference path="../typings/long/long.d.ts" />
define(["require", "exports", "./py_objects", "./utils", './opcodes'], function(require, exports, pyo, utils, opcodes) {
    //TODO Block class
    //byterun: Block = collections.namedtuple("Block", "type, handler, level")
    var Block = (function () {
        function Block(type, handler, level) {
            this.type = type;
            this.handler = handler;
            this.level = level;
        }
        return Block;
    })();
    exports.Block = Block;

    //TODO finish Function class
    var Function = (function () {
        function Function(name, py_code, globs, defaults, closure, vm) {
            this._vm = vm;
            this.func_code = py_code;
            if (py_code.name)
                this.func_name = py_code.name.toString();
            else
                this.func_name = "???";
            this.func_defaults = [defaults];
            this.func_globals = globs;
            this.func_dict = new utils.Dict();
            this.func_closure = closure;
            if (py_code.consts && (py_code.consts.value.length > 0))
                this.__doc__ = py_code.consts[0];
            else
                this.__doc__ = undefined;
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
        Function.prototype.toString = function () {
            return "<Function " + this.func_name + ">";
        };

        //TODO should be return Method...
        Function.prototype.__get__ = function (instance, owner) {
            return this;
        };
        Function.prototype.__call__ = function (a, args, kwargs) {
            if (a.length != this.func_code.argcount)
                throw new Error("FUNCTION ERR");

            //TODO if PY2
            var callargs = new utils.Dict();
            callargs.add('a', a);
            callargs.add('args', args);
            callargs.add('kwargs', kwargs);
            var frame = this._vm.make_frame(this.func_code, callargs, this.func_globals, new utils.Dict());

            //TODO generator stuff:
            var CO_GENERATOR = 32;
            var retval;
            if (this.func_code.flags & CO_GENERATOR) {
                retval = undefined;
            } else {
                retval = this._vm.run_frame(frame);
            }

            return retval;
        };
        return Function;
    })();
    exports.Function = Function;

    //TODO test everything
    exports.UNARY_OPS = {
        POSITIVE: function (arg) {
            return Math.abs(arg);
        },
        NEGATIVE: function (arg) {
            return -1 * Math.abs(arg);
        },
        NOT: function (arg) {
            return !arg;
        },
        CONVERT: function (arg) {
            return arg.toString();
        },
        INVERT: function (arg) {
            return arg;
        }
    };

    //TODO finish these / everything
    exports.BINARY_OPS = {
        POWER: Math.pow,
        ADD: function (x, y) {
            return x + y;
        },
        //TODO rest
        SUBTRACT: function (x, y) {
            return x - y;
        },
        MULTIPLY: function (x, y) {
            return x * y;
        },
        DIVIDE: function (x, y) {
            return x / y;
        }
    };

    var Frame = (function () {
        function Frame(code, globals, locals, back) {
            this.frame_code_object = code;
            this.globals = globals;
            this.locals = locals;
            this.back = back;
            if (back)
                this.builtins = back.builtins;

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
            this.generator = new pyo.PyNone();
            //        this.builtins = new utils.Dict<any>();
            //        this.builtins.add("range", "<NOT YET IMPLEMENTED>");
        }
        Frame.prototype.toString = function () {
            return "<Frame " + this.frame_code_object.filename + " " + this.lineno;
        };
        Frame.prototype.lineNumber = function () {
            var lnotab = this.frame_code_object.lnotab;
            var byte_increments = [];
            for (var i = 0; i < lnotab.length; i += 2)
                byte_increments.push(lnotab[i]);
            var line_increments = [];
            for (var i = 1; i < lnotab.length; i += 2)
                line_increments.push(lnotab[i]);

            //hopefully they are the same length...
            var byteNum = 0;
            var lineNum = this.frame_code_object.firstlineno;
            for (var i = 0; i < byte_increments.length; i += 1) {
                byteNum += byte_increments[i];
                if (byteNum > this.lasti)
                    break;
                lineNum += line_increments[i];
            }
            return lineNum;
        };
        return Frame;
    })();
    exports.Frame = Frame;

    var VirtualMachine = (function () {
        function VirtualMachine() {
            this.ERR = "VM ERROR";
            this.TAG = "VirtualMachine:";
            this.frames = [];
        }
        VirtualMachine.prototype.top = function () {
            return this.frame.stack[this.frame.stack.length - 1];
        };
        VirtualMachine.prototype.pop = function () {
            return this.frame.stack.pop();
        };
        VirtualMachine.prototype.push = function (val) {
            this.frame.stack.push(val);
        };
        VirtualMachine.prototype.popn = function (n) {
            console.assert(n < this.frame.stack.length, "ArrayIndex out of bounds");
            var result = [];
            for (var i = 0; i < n; i++)
                result.push(this.frame.stack.pop());
            return result;
        };

        //TODO public peek(i:number)
        /** move the bytecode pointer to 'jump', so it will execute next **/
        VirtualMachine.prototype.jump = function (jump) {
            this.frame.lasti = jump;
        };

        VirtualMachine.prototype.push_block = function (type, handler, level) {
            if (!level)
                level = this.frame.stack.length;
            this.frame.block_stack.push(new Block(type, handler, level));
            //       this.frame.block_stack.push(Block(type, handler, l))  //TODO (byterun/pyvm2.py line 85)
        };

        VirtualMachine.prototype.pop_block = function () {
            return this.frame.block_stack.pop();
        };

        VirtualMachine.prototype.make_frame = function (code, callargs, globals, locals) {
            if (typeof callargs === "undefined") { callargs = new utils.Dict(); }
            console.log("make frame: " + code.toString());
            var frame_globals, frame_locals;
            if (globals) {
                frame_globals = globals;
                if (locals)
                    frame_locals = globals;
            } else if (this.frame) {
                frame_globals = this.frame.globals;
                frame_locals = new utils.Dict();
            } else {
                frame_globals = new utils.Dict();
                frame_globals.add("__builtins__", "NOTYETIMPLEMENTED");
                frame_globals.add("__name__", "__main__");
                frame_globals.add("__doc__", undefined);
                frame_globals.add("__package__", undefined);
                frame_locals = frame_globals;
            }
            frame_locals.update(callargs);
            var frame = new Frame(code, frame_globals, frame_locals, this.frame);
            return frame;
        };

        //TODO push_frame
        VirtualMachine.prototype.push_frame = function (frame) {
            this.frames.push(frame);
            this.frame = frame;
        };
        VirtualMachine.prototype.pop_frame = function () {
            this.frames.pop();
            if (this.frames.length > 0)
                this.frame = this.frames[this.frames.length - 1];
            else
                this.frame = undefined;
        };

        //TODO print_frames
        //TODO resume_frame
        VirtualMachine.prototype.run_code = function (code, globals, locals) {
            var frame = this.make_frame(code, globals, locals);
            var val = this.run_frame(frame);
            if (this.frames.length > 0)
                throw new Error(this.ERR);
            if (this.frame && this.frame.stack.length > 0)
                throw new Error(this.ERR);
            return val;
        };

        VirtualMachine.prototype.run_frame = function (frame) {
            var INFO = this.TAG + " run_frame: ";
            this.push_frame(frame);
            while (true) {
                var byteinfo = this.parse_byte_and_args();
                if (byteinfo.length < 3)
                    throw new Error(this.ERR + ": byteinfo.length < 3 -- " + byteinfo.toString());
                console.log(INFO + " doing " + byteinfo.toString());
                var byteName = byteinfo[0];
                var byteCode = byteinfo[1];
                var offset = byteinfo[2];
                var arg;
                if (byteinfo.length > 3)
                    arg = byteinfo[3];
                var why = this.dispatch(byteName, byteCode, arg);
                if (why == "exception")
                    console.log(INFO + " why == exception (TODO)");
                if (why == "reraise")
                    why = "exception";
                if (why != "yield") {
                    while (why && frame.block_stack.length > 0)
                        why = this.manage_block_stack(why);
                }
                if (why)
                    break;
            }

            this.pop_frame();

            //TODO handle exceptions
            return this.returnval;
        };

        VirtualMachine.prototype.dispatch = function (byteName, byteCode, arg) {
            var INFO = this.TAG + " run_frame: ";
            var why;
            if (byteName.search(/UNARY_/) == 0)
                this.unaryOperator(byteName.slice(6, byteName.length));
            else if (byteName.search(/BINARY_/) == 0)
                this.binaryOperator(byteName.slice(7, byteName.length));
            else if (byteName.search(/INPLACE_/) == 0)
                this.inplaceOperator(byteName.slice(8, byteName.length));
            else if (byteName.search(/SLICE/) != -1)
                this.sliceOperator(byteName);
            else
                why = this.getOp(byteCode, arg);

            //        else {
            //            why = this.getOp(byteName, args);
            ////            var bytecode_fn = this.getOp(byteName);
            ////            if (!bytecode_fn) throw new Error(this.ERR);
            ////            why = bytecode_fn(args);
            //        }
            return why;
        };

        /**
        *
        * @returns {Array} = [opcode_name, opcode_number, offset, arg if there is one]
        */
        VirtualMachine.prototype.parse_byte_and_args = function () {
            var result = [];
            var f = this.frame;
            var offset = f.lasti;
            f.lasti++;
            var byteInfo = f.frame_code_object.get_byteinfo_at(offset, f.lasti);
            if (byteInfo.length < 2)
                throw new Error(this.ERR);
            var byteName = byteInfo[0];
            var byteCode = byteInfo[1];
            result.push(byteName);
            result.push(byteCode);
            result.push(offset);
            var arg;
            if (byteInfo.length >= 3) {
                arg = byteInfo[2];
                result.push(arg);
                f.lasti += 2;
            }

            return result;
        };

        /*** for looping, handling exceptions, returning **/
        VirtualMachine.prototype.manage_block_stack = function (why) {
            var TAG = "manage_block_stack(why=" + why + ")";
            if (why == "yield")
                throw new Error(this.ERR + " " + TAG);
            var block = this.frame.block_stack[this.frame.block_stack.length - 1];
            var whyResult = why;
            if (block.type == "loop" && why == "continue") {
                this.jump(this.returnval);
                whyResult = undefined;
                return whyResult;
            }
            this.pop_block();
            this.unwind_block(block);
            if (block.type == "loop" && why == "break") {
                whyResult = undefined;
                this.jump(block.handler);
                return whyResult;
            }
            if (block.type = "finally" || (block.type == "setup-except" && why == "exception") || block.type == "with") {
                if (why == "exception") {
                    var etype = this.last_exception[0], value = this.last_exception[1], tb = this.last_exception[2];
                    this.push(tb);
                    this.push(value);
                    this.push(etype);
                } else {
                    if (why == "return" || why == "continue")
                        this.push(this.returnval);
                    this.push(why);
                }
                whyResult = undefined;
                this.jump(block.handler);
                return whyResult;
            }
            return whyResult;
        };

        VirtualMachine.prototype.unwind_block = function (block) {
            var offset;
            if (block.type == "except-handler")
                offset = 3;
            else
                offset = 0;
            while (this.frame.stack.length > block.level + offset)
                this.pop();
            if (block.type == "except-handler") {
                var tb = this.pop();
                var value = this.pop();
                var exceptionType = this.pop();
                this.last_exception = [exceptionType, value, tb];
            }
        };

        VirtualMachine.prototype.unaryOperator = function (op) {
            var x = this.pop();
            this.push(exports.UNARY_OPS[op](x));
        };

        VirtualMachine.prototype.binaryOperator = function (op) {
            var x = this.pop();
            var y = this.pop();
            this.push(exports.BINARY_OPS[op](x, y));
        };

        VirtualMachine.prototype.inplaceOperator = function (op) {
            var x = this.pop();
            var y = this.pop();
            if (op == "POWER")
                x = Math.pow(x, y);
            else if (op == "MULTIPLY")
                x = x * y;
            else if (op == "DIVIDE")
                x = x / y;
            else
                throw new Error(this.ERR);
            //TODO the rest of these
        };

        //TODO verify this works
        VirtualMachine.prototype.sliceOperator = function (op) {
            var start = 0;
            var end;
            var op = op.slice(0, op.length - 2);
            var count = parseInt(op[op.length - 1]);
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
            if (!end)
                end = l.length;
            if (op.search(/STORE/) == 0) {
                //TODO not sure if this does what I think it should
                var res = this.pop();
                var pre = l.slice(0, start);
                var post = l.slice(end, l.length);
                l = pre.concat(res).concat(post);
            } else if (op.search(/DELETE/) == 0) {
                var pre = l.slice(0, start);
                var post = l.slice(end, l.length);
                l = l.concat(pre).concat(post);
            } else
                this.push(l.slice(start, end));
        };

        VirtualMachine.prototype.getOp = function (opcode, arg) {
            var result;
            switch (opcode) {
                case 100 /* LOAD_CONST */:
                    this.LOAD_CONST(arg);
                    break;
                case 90 /* STORE_NAME */:
                    this.STORE_NAME(arg);
                    break;
                case 101 /* LOAD_NAME */:
                    this.LOAD_NAME(arg);
                    break;
                case 1 /* POP_TOP */:
                    this.pop();
                    break;
                case 2 /* ROT_TWO */:
                    this.ROT_TWO();
                    break;
                case 3 /* ROT_THREE */:
                    this.ROT_THREE();
                    break;
                case 132 /* MAKE_FUNCTION */:
                    this.MAKE_FUNCTION(arg);
                    break;
                case 83 /* RETURN_VALUE */:
                    result = this.RETURN_VALUE();
                    break;
                case 107 /* COMPARE_OP */:
                    this.COMPARE_OP(arg);
                    break;
                case 120 /* SETUP_LOOP */:
                    this.SETUP_LOOP(arg);
                    break;
                case 110 /* JUMP_FORWARD */:
                    this.JUMP_FORWARD(arg);
                    break;
                case 114 /* POP_JUMP_IF_FALSE */:
                    this.POP_JUMP_IF_FALSE(arg);
                    break;
                case 71 /* PRINT_ITEM */:
                    //TODO we should make some kind of "stdout" for the browser (to print to the actual HTML page)
                    var item = this.pop();
                    console.log(" >> " + item.toString());
                    break;
                case 72 /* PRINT_NEWLINE */:
                    console.log(" >> ");
                    break;
                default:
                    throw new Error("unknown opcode: " + opcode);
            }
            return undefined;
        };

        VirtualMachine.prototype.LOAD_CONST = function (constant) {
            console.log("\tLOAD_CONST " + constant.toString());
            this.push(constant);
        };

        //TODO there are bugs here I think
        VirtualMachine.prototype.STORE_NAME = function (n) {
            console.log("\tSTORE_NAME " + n.toString());

            //        console.assert(n.type == "string" || n.type == "interned-string" || n.type == "string-ref");
            this.frame.locals.add(n.value.toString(), this.pop());
        };

        //TODO there are bugs here I think
        VirtualMachine.prototype.LOAD_NAME = function (n) {
            console.log("\tLOAD_NAME " + n.toString());
            var frame = this.frame;
            var name = n.value.toString();
            var val;
            if (frame.locals.contains(name))
                val = frame.locals.get(name);
            else if (frame.globals.contains(name))
                val = frame.globals.get(name);
            else {
                throw new Error(this.ERR + " LOAD_NAME on " + n.toString());
            }
            if (val)
                this.push(val);
        };

        VirtualMachine.prototype.ROT_TWO = function () {
            console.log("\tROT_TWO");
            var a = this.pop();
            var b = this.pop();
            this.push(b);
            this.push(a);
        };

        VirtualMachine.prototype.ROT_THREE = function () {
            console.log("\tROT_THREE");
            var a = this.pop();
            var b = this.pop();
            var c = this.pop();
            this.push(c);
            this.push(b);
            this.push(a);
        };

        VirtualMachine.prototype.DUP_TOP = function () {
            this.push(this.top());
        };

        VirtualMachine.prototype.RETURN_VALUE = function () {
            this.returnval = this.pop();
            console.log("\tRETURN_VALUE " + this.returnval.toString());

            //TODO if self.frame.generator
            return "return";
        };

        VirtualMachine.prototype.MAKE_FUNCTION = function (arg) {
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
        };

        VirtualMachine.prototype.COMPARE_OP = function (arg) {
            var y = this.pop();
            var x = this.pop();
            var result;
            switch (arg) {
                case 0:
                    result = x.value < y.value;
                    break;
                case 1:
                    result = x.value <= y.value;
                    break;
                case 2:
                    result = x.value == y.value;
                    break;
                case 3:
                    result = x.value != y.value;
                    break;
                case 4:
                    result = x.value > y.value;
                    console.log("\tCOMPARE_OP: " + arg.toString() + " : " + x.toString() + " > " + y.toString() + " => " + result);
                    break;
                case 5:
                    result = x.value >= y.value;
                    break;
                default:
                    break;
            }
            console.log("\tCOMPARE_OP: " + arg.toString() + " : " + x.toString() + " <?> " + y.toString() + " => " + result);
            if (!result)
                throw new Error("fail");
            this.push(result);
        };

        VirtualMachine.prototype.SETUP_LOOP = function (dest) {
            console.log("\tSETUP_LOOP");
            this.push_block("loop", dest);
        };

        VirtualMachine.prototype.JUMP_FORWARD = function (jump) {
            console.log("\tJUMP_FORWARD: jump = " + jump.toString());
            this.jump(jump);
        };

        VirtualMachine.prototype.POP_JUMP_IF_FALSE = function (jump) {
            var val = this.pop();
            console.log("\tPOP_JUMP_IF_FALSE: val = " + val.toString());
            if (!val)
                this.jump(jump);
        };
        return VirtualMachine;
    })();
    exports.VirtualMachine = VirtualMachine;
});
