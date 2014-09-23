///<reference path="node/node.d.ts" />

import fs = require('fs');
import util = require('util');

//PYC header = magic + timestamp = first 8 bytes (?)
//PYC contents = the rest

class PYCFile {
    header: any;
    contents: any;
    data: any;
	constructor(public filename: string) {
        console.log("reading " + filename);
        //synchronously read in the file associated with this object
        var data = fs.readFileSync(filename, "hex");
        this.data = data;
        console.log("read "+data.length+" bytes");
        if (data.length > 0) {
            this.header = data.slice(0, 8);
            this.contents = data.slice(9, data.length-1);
        }
        console.log("done reading");
	}
	getInfo(): string {
		return this.filename + " " + this.header.length + " " + this.contents.length;
	}
    getData(): string {
        return this.data;
    }
    parseHeader(): void {
        var magic = this.header.slice(0, 4);
        var timestamp = this.header.slice(4, this.header.length);
        console.log("magic: " + magic);
        console.log("timestamp: " + timestamp);
    }
    parseContents(): void {
        console.log("contents len: " + this.contents.length);
    }
}

//var pyc = new PYCFile("test.txt");


//var pyc = new PYCFile("test.txt");
//console.log("PYCFile info: "+pyc.getInfo());
//pyc.parseHeader();







