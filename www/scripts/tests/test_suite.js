//import opcodes = require("./opcodes");
define(["require", "exports"], function(require, exports) {
    var TestSuite = (function () {
        function TestSuite() {
        }
        TestSuite.prototype.test = function (filename, data) {
            console.log("testing on " + filename);
            //        var parser = new parse.Parser(filename, 0);
            //        parser.parse(data);
        };
        return TestSuite;
    })();
    exports.TestSuite = TestSuite;
});
