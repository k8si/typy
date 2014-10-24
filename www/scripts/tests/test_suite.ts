//import opcodes = require("./opcodes");

import parse = require("../helper/parse");

//TODO write more tests
//TODO use object of functions instead of if-clauses+string matching?

export class TestSuite {
    constructor(){ }

    public test(filename: string, data: any): number {
        console.log("testing on " + filename);
        //TODO just need to simplify to end of path
        if (filename == "http://localhost:3000/data/test_if.pyc") {
            console.log("got test: TEST_IF");
            var result = this.test_if(data); //TODO streamline "result" coordination, parser should just return 0 if success e.g.
            if (result) return 0;
            return 1;
        } else if (filename == "http://localhost:3000/data/test_for_loop.pyc") {
            console.log("got test: TEST_FOR_LOOP");
            var result = this.test_for_loop(data);
            if (result) return 0;
            return 1;
        }
        return 1; //"0 for success"
    }

    private test_for_loop(data: any): boolean {
        var passed = true;
//        var parser = new parse.Parser("test_for_loop.pyc", 0);
//        var result = parser.parse(data);
//        if (result != 0) return false;
        return false;
    }

    private test_if(data: any): boolean {
        var passed = true;
        var parser = new parse.Parser("test_if.pyc", 0);
        var result = parser.parse(data);
        if (result != 0) return false;
        return true;
    }

}