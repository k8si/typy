/// <reference path="../lib/node/node.d.ts" />

import fs = require('fs');
import StringDecoder = require('string_decoder');
import opcodes = require('./opcodes');
import utils = require('./utils');
import types = require('./types');
import path = require('path');
//import util = require('util');
//import path = require('path');

/*
 In a *.pyc (python bytecode) file:

 bytes : purpose
 [0, 1] : "magic number" that has something to do with "marshal" (Python's verison of Serialization)
 [2, 3] : carriage return and linefeed
 [4, 5, 6, 7] : timestamp of when the source was compiled into this file
 [8 .. rest] : output of "marshal.dump" i.e. the code object that results from compiling the source file

 each instruction = 3 bytes

 MARSHALL FORMAT


 */




class PYCFile {

    magic: any; //the magic number
    timestamp: any; //the timestamp of when the file was compiled
    contents: any; //the marshaled code object
    data: any; //the whole file as a hex string
    opcodes = opcodes.opcodes;
//    types = opcodes.type_dict;
    types = types.typeDict;
    typechars = types.typechars;

    constructor(public filename: string) {
        console.log("reading " + filename);
//        var decoder = new StringDecoder.StringDecoder('utf8');
        //synchronously read in the file associated with this object
        var data = fs.readFileSync(filename, null);
//        console.log(decoder.write(data));
        this.data = data;
        console.log("read "+data.length+" bytes");
        if (data.length > 0) {
//            this.magic = data.slice(0, 4);
//            this.timestamp = data.slice(4, 8);
//            this.contents = data.slice(8, data.length);
            this.contents = data;
        }
        console.log("done reading");
    }
    getInfo(): string { return this.filename + " " + this.contents.length; }
    getData(): string { return this.data; }
    printHeader(): void {
        console.log("magic: " + utils.bytestr_to_array(this.magic));
        console.log("timestamp: " + utils.bytestr_to_array(this.timestamp));
    }

    /*
     The marshal format in and of itself is very simple. It consists of a series of nested objects, represented by a type (uint8 -- a char, in fact) followed by some serialized data. All data is little-endian.
     */
    parseContents(): void {
        console.log("contents len: " + this.contents.length);
        var i = 0;
        while (i < this.contents.length) {
            var byte = this.contents[i];
            if (this.opcodes.contains(byte)) {
                console.log(byte + " = " + byte.toString(8) + " --> " + this.opcodes.get(byte));
            } else if (this.typechars.indexOf(String.fromCharCode(byte))) {
                console.log(byte + " " + this.typechars[this.typechars.indexOf(String.fromCharCode(byte))]);
            } else {
                console.log(byte + " = " + byte.toString(16));
            }
            i++;
        }
    }

}

/*
python code:
co = compile("a = 1", "f", "single")
with open("foo.pyc", "wb") as f:
    f.write(co.co_code)

dis output (i.e. dis.dis(co.co_code)):
 0 LOAD_CONST          0 (0)
 3 STORE_NAME          0 (0)
 6 LOAD_CONST          1 (1)
 9 RETURN_VALUE

our (io.ts) output:
 100 = 144 --> LOAD_CONST
 0 = 0 --> STOP_CODE
 0 = 0 --> STOP_CODE
 90 = 132 --> STORE_NAME
 0 = 0 --> STOP_CODE
 0 = 0 --> STOP_CODE
 100 = 144 --> LOAD_CONST
 1 = 1 --> POP_TOP
 0 = 0 --> STOP_CODE
 83 = 123 --> RETURN_VALUE
 */



var f = fs.realpathSync("../630-proj1/pyc/foo.pyc");
var pyc = new PYCFile(f);
pyc.parseContents();


