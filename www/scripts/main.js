BrowserFS.install(window);
var lsfs = new BrowserFS.FileSystem.LocalStorage();
BrowserFS.initialize(lsfs);

var fs = require('fs');

require(['helper/parse'], function(parse) {

    if (window.File && window.FileReader && window.FileList && window.Blob) console.log("FileReader suppported, good to go.");
    else alert('File APIs not supported');

    var p = new parse.Parser("");
    console.assert(p);

    //handler for upload button
    function handleFileSelect(evt) {
        var files = evt.target.files;
        if (files.length != 1) throw new Error("main.js: wrong number of files selected.");
        var file = files[0];
        var fr = new FileReader();
        if (!file) throw new Error("main.js: file seems to be undefined.");
        fr.onload = function (e) {
            console.log("got file: " + file.name + " (" + file.size + " bytes)");
            //TODO create test files dir using browserFS and store test files there for later
        };
        //main entrypoint into the interpreter
        fr.onloadend = function () {
            if (!fr.result || fr.readyState != 2) {
                throw new Error("main.js: something went wrong with FileReader");
            }
            var fname = '/'+ file.name;
            fs.writeFile(fname, fr.result, function(err) {
                if (err) throw err;
                console.log('wrote to ' + fname);
                fs.readFile(fname, function(err, contents) {
                    console.log(Buffer.isBuffer(contents));
                    var result = p.parse(contents);
                });
            });
//            var result = p.parse(fr.result);
        };

//        fr.readAsArrayBuffer(file);
//        fr.readAsBinaryString(file);
        fr.readAsText(file);
//        fr.readAsDataURL(file);
    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
//    document.getElementById('test_files').addEventListener('change', handleTestFileSelect, false);


});