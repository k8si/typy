/// <reference path="../lib/node/node.d.ts" />
var fs = require('fs');

var opcodes = require('./opcodes');
var utils = require('./utils');
var types = require('./types');

var PYCFile = (function () {
    function PYCFile(filename) {
        this.filename = filename;
        this.opcodes = opcodes.opcodes;
        this.types = types.typeDict;
        this.typechars = types.typechars;
        console.log("reading " + filename);

        //synchronously read in the file associated with this object
        var data = fs.readFileSync(filename, null);
        console.log("read " + data.length + " bytes");
        if (data.length > 0) {
            //            this.magic = data.slice(0, 4);
            //            this.timestamp = data.slice(4, 8);
            //            this.contents = data.slice(8, data.length);
            this.contents = data;
        }
        console.log("done reading");
    }
    PYCFile.prototype.getInfo = function () {
        return this.filename + " " + this.contents.length;
    };
    PYCFile.prototype.printHeader = function () {
        console.log("magic: " + utils.bytestr_to_array(this.magic));
        console.log("timestamp: " + utils.bytestr_to_array(this.timestamp));
    };

    PYCFile.prototype.parseContents = function () {
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
    };
    return PYCFile;
})();

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
