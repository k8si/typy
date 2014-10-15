BrowserFS.install(window);
var lsfs = new BrowserFS.FileSystem.LocalStorage();
//    var lsfs = new BrowserFS.FileSystem.HTML5FS(100);
BrowserFS.initialize(lsfs);

var fs = require('fs');
//var parse = require(['helper/parse'], function(util) {
//    console.log('loaded parse');
//});

var parse = require(['helper/parse'], function(parse) {

    var p = new parse.Parser("");
    console.assert(p);

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        console.log("ok.");
    } else {
        alert('File APIs not supported');
    }
    function handleFileSelect(evt) {
        var files = evt.target.files;
        var output = [];
        var file = files[0];
        if (file) {
            var fr = new FileReader();
            fr.onload = function (e) {
                var contents = e.target.result;
                console.log("got file: " + file.name + " , " + file.size);
            };
            fr.onloadend = function () {
                p.parse(fr.result, 8);

//            define(["require", "exports", 'helper/parse'], function(require, exports, f) {
//                console.log('got here');
//                var p = new f.Parser("");
//                p.parse(fr.result, 8);
//            });

//            console.assert(fr.result);
//            var p = new parse.Parser("");
//            console.assert(p);
//            parse.Parser.read_object(fr.result);
//            var p = new parse.Parser("");
//            if (p) p.parse(fr.result, 8);
//            console.assert(parse);

//            var parser = new parse.Parser("test.pyc");
//            if (parser && fr.result) parser.parse(fr.result, 8);
//            fs.writeFile('/test.pyc', fr.result, function(err){
//                if (err) throw err;
//                console.log('wrote /test.pyc');
//            });
            };

            fr.readAsBinaryString(file);

        } else {
            alert("fail");
        }
    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
});