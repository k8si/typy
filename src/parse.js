/// <reference path="../lib/node/node.d.ts" />
/// <reference path="../typings/long/long.d.ts" />
define(["require", "exports", './opcodes', './utils', './py_objects', "./interpret", 'long'], function(require, exports, opcodes, utils, pyo, interp, Long) {
    /**
    * All of this was stolen from UnPyc (http://sourceforge.net/projects/unpyc/)
    * All I did was port Python (from UnPyc/Parse.py) -> Typescript
    */
    /*
    TODO verify the little/big endian-ness of things
    TODO float vs long?
    */
    var Parser = (function () {
        function Parser(filename, offset) {
            if (typeof offset === "undefined") { offset = 8; }
            this.type_map = opcodes.TypeMap;
            this.PARSE_ERR = "parser error";
            this.filename = filename;
            this.internedStringList = new Array();
        }
        Parser.prototype.parse = function (bstring, offset) {
            this.pc = 0;
            console.log("\nparsing...");
            var buf = new Buffer(bstring.slice(offset, bstring.length));
            var pyObject = this.read_object(buf);
            console.log("done. starting interpreter...");
            var vm = new interp.VirtualMachine();
            var result = vm.run_code(pyObject);
            console.log("finished.");
        };

        Parser.prototype.read_byte = function (data) {
            if (this.pc + 1 > data.length)
                throw new Error(this.PARSE_ERR);
            return data.readUInt8(this.pc++);
        };

        //    private static read_short(data:Buffer): number {
        //        console.assert(Parser.pc + 2 <= data.length, Parser.PARSE_ERR);
        //        var short = data.readInt16LE(Parser.pc); //TODO verify this is actually analogous to "read_short"
        //        Parser.pc += 2;
        //        return short;
        //    }
        //
        //    /**
        //     * read a 64 bit two's-complement integer value ??
        //     *
        //     * TODO no idea what's going on here i.e. whether or not this actually does the right thing
        //     * TODO should return type Long (or LongStatic?) but I get a compiler error
        //     * **/
        Parser.prototype.read_type_long = function (data) {
            console.assert(this.pc + 8 <= data.length, this.PARSE_ERR);
            var low32 = this.read_long(data);
            var high32 = this.read_long(data);
            return new Long(low32, high32);
            //        var n = Parser.read_long(data);
            //        var sign = 1;
            //        if (n < 0){ sign = -1; n = -1*n;}
            //        console.assert(Parser.pc + 2 * n <= data.length, Parser.PARSE_ERR);
            //        var raw = '';
            ////    var l = 0L;
            //        var l = 0;
            //        for (var i = 0; i < n; i++) {
            //            var d = Parser.read_short(data);
            //            console.assert(d >= 0, Parser.PARSE_ERR);
            //            l += Math.pow(d * 32768, i);
            //            //raw += d.raw
            //        }
            //        return l * sign;
        };

        //
        Parser.prototype.read_long = function (data) {
            if (this.pc + 4 > data.length)
                throw new Error("parsing error");
            var long = data.readInt32LE(this.pc);
            this.pc += 4;
            return long;
        };

        Parser.prototype.read_unsigned_long = function (data) {
            if (this.pc + 4 > data.length)
                throw new Error(this.PARSE_ERR);
            var ulong = data.readUInt32LE(this.pc);
            this.pc += 4;
            return ulong;
        };

        //
        Parser.prototype.read_float = function (data) {
            if (this.pc + 8 > data.length)
                throw new Error(this.PARSE_ERR);
            var float = data.readDoubleLE(this.pc);
            this.pc += 8;
            return float;
        };

        //
        //
        Parser.prototype.read_string = function (data) {
            var coLength = this.read_long(data);
            var co_code = new Buffer(coLength);
            data.copy(co_code, 0, this.pc, this.pc + coLength);
            this.pc += coLength;
            return co_code;
        };

        //
        Parser.prototype.read_tuple = function (data) {
            var n = this.read_long(data);

            //        console.log("got tuple of len " + n + ": ");
            console.assert(n >= 0, this.PARSE_ERR);
            var a = [];
            for (var i = 0; i < n; i++) {
                var o = this.read_object(data);
                a.push(o);
                //            a.push(Parser.read_object(data));
            }

            //        for (var i = 0; i < n; i++) {
            //            if (a[i]) console.log("\t" + a[i].toString());
            //            else console.log("\t" + a[i]);
            //        }
            return a;
        };

        //
        //    /*
        //     def r_dict(self):
        //     offset = self.p
        //     d = {}
        //     k = self.r_object()
        //     while k.__class__.__name__ != 'pyNull':
        //     d[k] = self.r_object()
        //     k = self.r_object()
        //     return pyDict(offset, d[k)
        //     */
        //    //TODO fix/make sure this works
        Parser.prototype.read_dict = function (data) {
            console.log("read_dict...");
            var d = new utils.Dict();
            var k = this.read_object(data);
            while (k != undefined && k != null) {
                var val = this.read_object(data);
                if (val != undefined && val != null && val.value != undefined && val.value != null)
                    d.add(k, this.read_object(data));
                else
                    break;
                k = val;
            }
            return d;
        };

        //TODO this could probably be more succint
        Parser.prototype.read_object = function (data, extra) {
            if (this.pc + 1 > data.length)
                throw new Error("parser error");
            console.log(typeof data);

            //        var byte = 0;
            var byte = data.readUInt8(this.pc);

            //        if (extra) console.log(extra + " : current typechar: " + String.fromCharCode(byte));
            var offset = this.pc;
            this.pc++;
            var tm = this.type_map;
            switch (byte) {
                case 79 /* NULL */:
                    return new pyo.PyNull();

                case 78 /* NONE */:
                    return new pyo.PyNone();

                case 83 /* STOPITER */:
                    return new pyo.PyStopIter();

                case 46 /* ELLIPSIS */:
                    return new pyo.PyEllipsis();

                case 70 /* FALSE */:
                    return new pyo.PyFalse();

                case 84 /* TRUE */:
                    return new pyo.PyTrue();

                case 105 /* INT */:
                    //                console.log("found int @ " + offset);
                    return new pyo.PyInt(this.read_long(data));

                case 73 /* INT64 */:
                    //                console.log("found int64");
                    var lo4 = this.read_unsigned_long(data);
                    var hi4 = this.read_long(data);
                    return new pyo.PyInt64(new Long(lo4, hi4));

                case 108 /* LONG */:
                    //                console.log("found long");
                    return new pyo.PyLong(this.read_type_long(data));

                case 102 /* FLOAT */:
                    //                console.log("found float");
                    return new pyo.PyFloat(this.read_float(data));

                case 103 /* BINARY_FLOAT */:
                    //                console.log("found binary_float");
                    return undefined;

                case 120 /* COMPLEX */:
                    //                console.log("found complex");
                    return undefined;

                case 121 /* BINARY_COMPLEX */:
                    //                console.log("found binary_complex");
                    return undefined;

                case 116 /* INTERNED */:
                    //                console.log("found interned @ " + offset);
                    var tmp = this.read_string(data);
                    this.internedStringList.push(tmp);
                    return new pyo.PyInterned(tmp);

                case 115 /* STRING */:
                    //                console.log("found string @ " + offset);
                    return new pyo.PyString(this.read_string(data));

                case 82 /* STRINGREF */:
                    //                console.log("found stringref @ " + offset);
                    var i = this.read_long(data);
                    var interned = this.internedStringList[i];
                    return new pyo.PyStringRef(interned);

                case 117 /* UNICODE */:
                    var tmp = this.read_string(data);
                    return new pyo.PyUnicode(tmp.toString('utf8'));

                case 40 /* TUPLE */:
                    //                console.log("found tuple @ " + offset);
                    return new pyo.PyTuple(this.read_tuple(data));

                case 91 /* LIST */:
                    console.log("!!!! found list");
                    return undefined;

                case 123 /* DICT */:
                    console.log("!!!! found dict @ " + offset);
                    return undefined;

                case 62 /* FROZENSET */:
                    console.log("!!!! found frozenset @ " + offset);
                    return undefined;

                case 99 /* CODE */:
                    //based on http://daeken.com/2010-02-20_Python_Marshal_Format.html
                    var argcount = this.read_long(data);
                    var nlocals = this.read_long(data);
                    var stacksize = this.read_long(data);
                    var flags = this.read_long(data);

                    //PyString
                    //                console.log("code: " + String.fromCharCode(byte));
                    var code = this.read_object(data, "code");

                    //should be PyTuples
                    //                console.log("consts: " + String.fromCharCode(byte));
                    var consts = this.read_object(data, "consts");
                    var names = this.read_object(data, "names");
                    var varnames = this.read_object(data, "varnames");
                    var freevars = this.read_object(data, "freevars");
                    var cellvars = this.read_object(data, "cellvars");

                    var filename = this.read_object(data, "filename");
                    var name = this.read_object(data, "name");

                    var firstlineno = this.read_long(data);
                    var lnotab = this.read_long(data);

                    var obj = new pyo.PyCodeObject(offset, argcount, nlocals, stacksize, flags, code, consts, names, varnames, freevars, cellvars, filename, name, firstlineno, lnotab);

                    console.log(obj.toString());

                    //                obj.print_co_code();
                    //                obj.parse_co_code();
                    return obj;

                default:
                    console.log('unknown type');
                    return undefined;
            }
        };
        return Parser;
    })();
    exports.Parser = Parser;
});
