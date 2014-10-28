import parse = require("../helper/parse");

//TODO write more tests, bring more structure into vm/parser output to test for certain properties
//TODO use object of functions instead of if-clauses+string matching?


//all of these separate test fxns seem unecessary right now but I think they will be more necessary once we
// start testing specific properties of the output...?
export var TestDict = {
    "http://localhost:3000/data/test_if.pyc": function (data) {
        var parser = new parse.Parser("test_if.pyc", 0); //TODO probably no reason to keep creating a new parser object each time
        return parser.parse(data, "test_if.pyc");
    },
    "http://localhost:3000/data/test_for_loop.pyc": function (data) {
        var parser = new parse.Parser("test_for_loop.pyc", 0);
        return parser.parse(data, "test_for_loop.pyc");
    },
    "http://localhost:3000/data/test_while_loop.pyc": function (data) {
        var parser = new parse.Parser("test_while_loop.pyc", 0);
        return parser.parse(data, "test_while_loop.pyc");
    },
    "http://localhost:3000/data/test_list.pyc": function (data) {
        var parser = new parse.Parser("test_list.pyc", 0);
        return parser.parse(data, "test_list.pyc");
    },
    "http://localhost:3000/data/test_neg_numbers.pyc": function (data) {
        var parser = new parse.Parser("test_neg_numbers.pyc", 0);
        return parser.parse(data);
    },
    "http://localhost:3000/data/test_dict.pyc": function(data) {
        var parser = new parse.Parser("test_dict.pyc", 0);
        return parser.parse(data, "test_neg_numbers.pyc");
    },
    "http://localhost:3000/data/test_math.pyc": function(data){
        var parser = new parse.Parser("test_math.pyc", 0);
        return parser.parse(data, "test_math.pyc");
    },
    "http://localhost:3000/data/test_fxn.pyc": function(data){
        var parser = new parse.Parser("test_fxn.pyc", 0);
        return parser.parse(data, "test_fxn.pyc");
    },
    "http://localhost:3000/data/test_float.pyc": function(data){
        var parser = new parse.Parser("test_float.pyc", 0);
        return parser.parse(data, "test_float.pyc");
    },
    "http://localhost:3000/data/test_tuple.pyc": function(data){
        var parser = new parse.Parser("test_tuple.pyc", 0);
        return parser.parse(data, "test_tuple.pyc");
    },
    "http://localhost:3000/data/test_fib.pyc": function(data){
        var parser = new parse.Parser("test_fib.pyc", 0);
        return parser.parse(data, "test_fib.pyc");
    }
};

export class TestSuite {
    constructor(){ }
    public test(filename: string, data: any): number {
        console.log("testing on " + filename);
        if (filename in TestDict) return TestDict[filename](data);
        else throw new Error("TestSuite: no test defined for " + filename);
        return 1; //"0 for success"
    }
}