BrowserFS.install(window);
var lsfs = new BrowserFS.FileSystem.LocalStorage();
BrowserFS.initialize(lsfs);

var fs = require('fs');

require(['tests/test_suite'], function(test_suite) {
    console.log("TyPy Test Suite");
    if (window.File && window.FileReader && window.FileList && window.Blob) console.log("FileReader suppported, good to go.");
    else alert('File APIs not supported');
    var tsuite = new test_suite.TestSuite();
    function readBlob() {
        var files = document.getElementById('files').files;
        if (!files.length) { alert("no files selected!"); return; }
        for (var i = 0, f; f = files[i]; i++) {
            var file = files[i];
            var start = 0;
            var stop = file.size - 1;
            var reader = new FileReader();
            reader.onloadend = function(event) {
                if (event.target.readyState == FileReader.DONE) {
                    tsuite.test(file.name, event.target.result);
                }
            };
            var blob = file.slice(start, stop+1);
            reader.readAsBinaryString(blob);
        }
    }
    document.getElementById('files').addEventListener('change', readBlob, false);
});