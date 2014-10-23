//import opcodes = require("./opcodes");

import parse = require("../helper/parse");

export class TestSuite {
    constructor(){ }

    public test(filename: string, data: any): void {
        console.log("testing on " + filename);
//        var parser = new parse.Parser(filename, 0);
//        parser.parse(data);
    }

}