define(["require", "exports", './utils', './builtins'], function(require, exports, utils, bi) {
    var ListIterator = (function () {
        function ListIterator(list) {
            this.list = list;
            this.currIdx = 0;
        }
        ListIterator.prototype.hasNext = function () {
            return this.currIdx < this.list.length();
        };
        ListIterator.prototype.next = function () {
            var ret;
            if (this.hasNext()) {
                ret = this.list.value[this.currIdx];
                this.currIdx++;
                return ret;
            } else
                throw new Error("ListIteratorError: no next item");
        };
        return ListIterator;
    })();
    exports.ListIterator = ListIterator;

    var Frame = (function () {
        function Frame(code, globals, locals, back) {
            this.frame_code_object = code;
            this.globals = globals;
            this.locals = locals;
            this.back = back;

            if (back)
                this.builtins = back.builtins;
            else {
                this.builtins = bi.builtins;
            }

            //TODO else { this.builtins = locals['__builtins__'] ...} (byterun/pyobj.py line 147)
            this.lineno = code.firstlineno;

            /*TODO CPython comment: PyFrame_New now sets f->f_lasti to -1 (i.e. the index *before* the first instruction)
            and YIELD_VALUE doesn't fiddle with f_lasti any more. */
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
            this.generator = undefined; //TODO
        }
        Frame.prototype.toString = function () {
            return "<Frame " + this.frame_code_object.filename + " " + this.lineno;
        };

        Frame.prototype.print_stack = function () {
            if (this.stack.length == 0)
                console.log("<EMPTY>");
            else {
                for (var i = 0; i < this.stack.length; i++) {
                    console.log("@" + i + " : " + this.stack[i].toString());
                }
            }
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

    //TODO Block class
    //byterun: Block = collections.namedtuple("Block", "type, handler, level")
    var Block = (function () {
        function Block(type, handler, level) {
            this.type = type;
            this.handler = handler;
            this.level = level;
        }
        Block.prototype.toString = function () {
            return "<Block type=" + this.type.toString() + " handler=" + this.handler.toString() + " level=" + this.level.toString();
        };
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
});
