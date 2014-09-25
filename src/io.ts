/// <reference path="../lib/node/node.d.ts" />

import fs = require('fs');
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
 */

class PYCFile {

    magic: any; //the magic number
    timestamp: any; //the timestamp of when the file was compiled
    contents: any; //the marshaled code object
    data: any; //the whole file as a hex string

	constructor(public filename: string) {
        console.log("reading " + filename);
        //synchronously read in the file associated with this object
        var data = fs.readFileSync(filename, "hex");
        this.data = data;
        console.log("read "+data.length+" bytes");
        if (data.length > 0) {
            this.magic = data.slice(0, 4);
            this.timestamp = data.slice(4, 8);
            this.contents = data.slice(8, data.length-1);
        }
        console.log("done reading");
	}

	getInfo(): string {
		return this.filename + " " + this.contents.length;
	}
    getData(): string {
        return this.data;
    }
    parseHeader(): void {
//        var magic = this.header.slice(0, 4);
        console.log("magic: " + this.bytestr_to_array(this.magic));
        var arr = this.bytestr_to_array(this.magic);
        var s = this.bytes2str(arr);
        console.log("2str: " + s);
//        var timestamp = this.header.slice(4, this.header.length);
//        console.log("magic: " + magic);
//        console.log("timestamp: " + this.bytestr_to_array(timestamp));
    }
    parseContents(): void {
        console.log("contents len: " + this.contents.length);
        var a = this.bytestr_to_array(this.contents);
        console.log(a);
    }
    //lifted from doppio
    bytestr_to_array(bytecode_string: string): number[] {
        var rv : number[] = [];
        for (var i = 0; i < bytecode_string.length; i++) {
//            rv.push(bytecode_string.charCodeAt(i) & 0xFF);
              rv.push(bytecode_string.charCodeAt(i));
        }
        return rv;
    }
    //lifted from dopio
    bytes2str(bytes: number[], null_terminate?: boolean): string {
        var y : number;
        var z : number;
        var idx = 0;
        var rv = '';
        while (idx < bytes.length) {
            var x = bytes[idx++] & 0xff;
//            if (null_terminate && x == 0) {
//                break;
//            }
            rv += String.fromCharCode(x <= 0x7f ? x : x <= 0xdf ? (y = bytes[idx++], ((x & 0x1f) << 6) + (y & 0x3f)) : (y = bytes[idx++], z = bytes[idx++], ((x & 0xf) << 12) + ((y & 0x3f) << 6) + (z & 0x3f)));
        }
        return rv;
    }
//    read_int32()
}

var pyc = new PYCFile("/Users/kate/630/630-proj1/pyc/add.pyc");
pyc.parseHeader();








