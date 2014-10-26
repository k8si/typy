/// <reference path="lib/node/node.d.ts" />
/// <reference path="typings/long/long.d.ts" />

import fs = require('fs');
import path = require('path');
import opcodes = require('./opcodes');
import utils = require('./utils');
import pyo = require('./py_objects');
import interp = require("./interpret");
import Long = require('long'); //https://github.com/borisyankov/DefinitelyTyped/blob/master/long/long.d.ts
//import numbers = require('./numbers');
import gLong = require('./gLong');

/**
 * All of this was stolen from UnPyc (http://sourceforge.net/projects/unpyc/)
 * All I did was port Python (from UnPyc/Parse.py) -> Typescript
 */


/*
 TODO int vs. float vs long?
 */

export class Parser {

    private filename: string;
    private pc: number;
    private type_map = opcodes.TypeMap;
    private PARSE_ERR: string = "parser error";
    private internedStringList: Array<Buffer>;

    //TODO there is absolutely no reason for these constructor params anymore
    constructor(filename:string, offset:number=8) {
        this.filename = filename;
        this.internedStringList = new Array<Buffer>();
    }

    private bytestr_to_array(bstring: string): number[] {
        var rv: number[] = [];
        for (var i = 0; i < bstring.length; i++) {
            var char = bstring.charCodeAt(i);
            rv.push(char & 0xffff);
        }
        return rv;
    }

    private bytearray_2_buffer(bytes: number[], offset: number = 0, len: number = bytes.length): Buffer {
        var buff = new Buffer(len), i: number;
        for (i = 0; i < len; i++) {
            buff.writeInt8(bytes[offset+i], i);
        }
        return buff;
    }

    private bytes2str(bytes: number[], nullterm?:boolean): string {
        var y: number, z: number;
        var idx = 0;
        var rv = '';
        while (idx < bytes.length) {
            var x = bytes[idx++] & 0xff;
            if (nullterm && x == 0) break;
            rv += String.fromCharCode(
                    x <= 0x7f ? x : x <= 0xdf ? (y = bytes[idx++],
                    ((x & 0x1f) << 6) + (y & 0x3f)) : (y = bytes[idx++],
                    z = bytes[idx++],
                    ((x & 0xf) << 12) + ((y & 0x3f) << 6) + (z & 0x3f))
            );
        }
        return rv;
    }

    public parse(datastr: string): number {
        console.log("parsing...");
        this.pc = 0;
        console.log(datastr.length);
        var buf = new Buffer(datastr);
        while (this.pc + 1 < buf.length) {
            var b = buf.readUInt8(this.pc);
            if (b == this.type_map.CODE) break;
            else this.pc++;
        }

        var firstChar = buf.readUInt8(this.pc);
        if (firstChar != 99) throw new Error("error: first char is not 'c'");
        var obj = this.read_object(buf);

        if (obj) {
            console.log("done parsing.");
          var vm = new interp.VirtualMachine();
            var result = vm.run_code(obj);
            if (result) return 0;
        }
        return 1;
    }

    private binstring(nmask): string {
        for (var nflag = 0, nshifted = nmask, smask = ""; nflag < 32; nflag++, smask+=String(nshifted >>> 31), nshifted <<= 1);
        return smask;
    }

    private r_byte(data: Buffer): number {
        var val = data.readInt8(this.pc);
        this.pc += 1;
        return val;
    }

    //TODO this could probably be more succint
    private read_object(data:Buffer, extra?: string): any {
        if (this.pc + 1 > data.length) throw new Error("parser error");
        var byte = data.readUInt8(this.pc); //read a char (1 byte)
//        console.log("current typechar @ " + this.pc + " : " + byte + " " + String.fromCharCode(byte));
        var offset = this.pc; //for bookkeeping
        this.pc++;
        var tm = this.type_map;
        switch(byte) {
            case tm.NULL: return new pyo.PyNull();
            case tm.NONE: return new pyo.PyNone();
            case tm.STOPITER: return new pyo.PyStopIter();
            case tm.ELLIPSIS: return new pyo.PyEllipsis();
            case tm.FALSE: return new pyo.PyFalse();
            case tm.TRUE: return new pyo.PyTrue();
            case tm.INT: return new pyo.PyInt(this.read_long(data));

            //TODO not sure if this is correct
            case tm.INT64: throw new Error("INT64 not yet implemented");
//                console.log("found int64");
//                var lo4 = this.read_unsigned_long(data);
//                var hi4 = this.read_long(data);
//                return new pyo.PyInt64(new Long(lo4, hi4));

            case tm.LONG: throw new Error("LONG not yet implemented"); //return new pyo.PyLong(this.read_type_long(data));

            case tm.FLOAT: throw new Error("FLOAT not yet implemented"); //return new pyo.PyFloat(this.read_float(data));

            case tm.BINARY_FLOAT: throw new Error("BINARY_FLOAT not yet implemented");
//                console.log("found binary_float");
//                return new pyo.PyFloat(this.read_float(data));

            case tm.COMPLEX: throw new Error("COMPLEX not yet implemented.");

            case tm.BINARY_COMPLEX: throw new Error("BINARY_COMPLEX not yet implemented");

            case tm.INTERNED:
                var tmp = this.read_string(data);
                this.internedStringList.push(tmp);
                return new pyo.PyInterned(tmp);

            case tm.STRING: return new pyo.PyString(this.read_string(data));


            case tm.STRINGREF:
                var i = this.read_long(data); //new pyo.PyLong(offset, Parser.read_long(data));
                var interned = this.internedStringList[i];
                return new pyo.PyStringRef(interned);

            case tm.UNICODE: throw new Error("UNICODE not yet implemented");

            case tm.TUPLE: return new pyo.PyTuple(this.read_tuple(data));

            case tm.LIST: throw new Error("parse.ts: type LIST not yet implemented");
//                return new pyo.PyList(offset, this.read_tuple(data)); //TODO

            case tm.DICT: throw new Error("parse.ts: type DICT not yet implemented");

            case tm.FROZENSET: throw new Error("parse.ts: type FROZENSET not yet implemented");

            case tm.CODE:
                //based on http://daeken.com/2010-02-20_Python_Marshal_Format.html
                var argcount: number = this.read_long(data);
                var nlocals:  number = this.read_long(data);
                var stacksize: number = this.read_long(data);
                var flags: number = this.read_long(data);
                var code: pyo.PyString = this.read_object(data, "code");
                var consts: pyo.PyTuple = this.read_object(data, "consts");
                var names: pyo.PyTuple = this.read_object(data, "names");
                var varnames: pyo.PyTuple = this.read_object(data, "varnames");
                var freevars: pyo.PyTuple = this.read_object(data, "freevars");
                var cellvars: pyo.PyTuple = this.read_object(data, "cellvars");
                var filename: pyo.PyString = this.read_object(data, "filename");
                var name: pyo.PyString = this.read_object(data, "name");
                var firstlineno: number = this.read_long(data);
                var lnotab: number = this.read_long(data);

                var obj: pyo.PyCodeObject = new pyo.PyCodeObject(offset, //offset
                    argcount, nlocals, stacksize, flags,
                    code,
                    consts, names, varnames, freevars, cellvars,
                    filename, name,
                    firstlineno, lnotab
                );

//                console.log(obj.toString());

                return obj;

            default:
                console.log('unknown type ' + byte + ' ' + String.fromCharCode(byte));
                throw new Error("parse.ts: unknown type: " + byte);
        }
    }

    private read_short(data:Buffer): number {
        var val = data.readInt16LE(this.pc);
        this.pc += 2;
        return val;

    }

////    /**
////     * read a 64 bit two's-complement integer value ??
////     *
////     * TODO no idea what's going on here i.e. whether or not this actually does the right thing
////     * TODO should return type Long (or LongStatic?) but I get a compiler error
////     * **/
//    private read_type_long(data:Buffer): number {
//        console.assert(this.pc + 8 <= data.length, this.PARSE_ERR);
//        var n = this.read_long(data);
//        this.pc = this.pc - 4;
//        var sign = 1;
//        if (n < 0){ sign = -1; n = -n;}
//        console.assert(this.pc + (2 * Math.abs(n)) <= data.length, "err (this.pc+2n > data.length)");
//        var l = 0;
//        for (var i = 0; i < n; i++) {
//            var d = this.read_short(data);
//            console.assert(d >= 0, "err !(d>=0)");
//            l += Math.pow(d * 32768, i);
//            //raw += d.raw
//        }
//        return l * sign;
//    }
//
    private read_long(data:Buffer): number {
        if (this.pc + 4 > data.length) throw new Error("parsing error");
        var longval = data.readInt32LE(this.pc);
        this.pc += 4;
        return longval;
    }

    private read_unsigned_long(data:Buffer): number {
        if (this.pc + 4 > data.length) throw new Error(this.PARSE_ERR);
        var ulong = data.readUInt32LE(this.pc);
        this.pc += 4;
        return ulong;
    }
//
    private read_float(data:Buffer): number {
        if (this.pc + 8 > data.length) throw new Error(this.PARSE_ERR);
        var float = data.readDoubleLE(this.pc);
        this.pc += 8;
        return float;
    }


    private read_string(data:Buffer): Buffer {
        var coLength = this.read_long(data);
        var co_code = new Buffer(coLength);
        data.copy(co_code, 0, this.pc, this.pc+coLength);
        this.pc += coLength;
        return co_code;
    }
//
    private read_tuple(data:Buffer): any[] {
        var n = this.read_long(data);
        console.assert(n >= 0, this.PARSE_ERR);                
        var a = [];
        for (var i = 0; i < n; i++) {
            var o = this.read_object(data);
            a.push(o);
        }
        return a;
    }
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
    private read_dict(data:Buffer): utils.Dict<any> {
        console.log("read_dict...");
        var d = new utils.Dict<any>();
        var k = this.read_object(data);
        while (k != undefined && k != null) {
            var val = this.read_object(data);
            if (val != undefined && val != null && val.value != undefined && val.value != null) d.add(k, this.read_object(data));
            else break;
            k = val;
        }
        return d;
    }




}






