//import opcodes = require("./opcodes");

import parse = require("../helper/parse");

export class TestSuite {
    constructor(){ }

    public test(filename: string, data: any): number {
        console.log("testing on " + filename);
        if (filename == "http://localhost:3000/data/test_if.pyc") {
            console.log("got test: TEST_IF");
            return 1;
        } else if (filename == "http://localhost:3000/data/test_for_loop.pyc") {
            console.log("got test: TEST_FOR_LOOP");

            return 1;
        }

//        var parser = new parse.Parser(filename, 0);
//        parser.parse(data);
        return 0;
    }

    private test_for_loop(data: any): boolean {
        var passed = true;
        var parser = new parse.Parser("test_for_loop.pyc", 0);
        var result = parser.parse(data);
        if (result != 0) return false;
    }

}