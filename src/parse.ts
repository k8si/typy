/// <reference path="../lib/node/node.d.ts" />

import fs = require('fs');
import path = require('path');
import opcodes = require('./opcodes');
import utils = require('./utils');
import types = require('./types');

class PYCFile {
    magic: any; //the magic number
    timestamp: any; //the timestamp of when the file was compiled
    contents: any; //the marshaled code object
    opcodes = opcodes.opcodes;
    types = types.typeDict;
    typechars = types.typechars;

    constructor(public filename: string) {
        console.log("reading " + filename);
        //synchronously read in the file associated with this object
        var data = fs.readFileSync(filename, null);
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
    printHeader(): void {
        console.log("magic: " + utils.bytestr_to_array(this.magic));
        console.log("timestamp: " + utils.bytestr_to_array(this.timestamp));
    }

    parseContents(): void {
        console.log("contents len: " + this.contents.length);
        var i = 0;
        while (i < this.contents.length) {
            var byte = this.contents[i];
            if (this.opcodes.contains(byte)) {
                console.log(byte + " = " + byte.toString(16) + " --> " + this.opcodes.get(byte));
//            } else if (this.typechars.indexOf(String.fromCharCode(byte))) {
//                console.log(byte + " " + this.typechars[this.typechars.indexOf(String.fromCharCode(byte))]);
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

our (parse.ts) output:
 100 = 64 --> LOAD_CONST
 0 = 0 --> STOP_CODE
 0 = 0 --> STOP_CODE
 90 = 5a --> STORE_NAME
 0 = 0 --> STOP_CODE
 0 = 0 --> STOP_CODE
 100 = 64 --> LOAD_CONST
 1 = 1 --> POP_TOP
 0 = 0 --> STOP_CODE
 83 = 53 --> RETURN_VALUE
 */



var f = fs.realpathSync("../630-proj1/pyc/foo.pyc");
var pyc = new PYCFile(f);
pyc.parseContents();


