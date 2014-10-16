BrowserFS.install(window);
var lsfs = new BrowserFS.FileSystem.LocalStorage();
BrowserFS.initialize(lsfs);

var fs = require('fs');

require(['helper/parse'], function(parse) {

    var p = new parse.Parser("");
    console.assert(p);

    //TODO this should probably only check if the browser supports FileReader?
    if (window.File && window.FileReader && window.FileList && window.Blob) console.log("ok.");
    else alert('File APIs not supported');

    //handler for upload button
    function handleFileSelect(evt) {
        var files = evt.target.files;
        var file = files[0];
        if (file) {
            var fr = new FileReader();
            fr.onload = function (e) { console.log("got file: " + file.name + " (" + file.size + " bytes)"); };
            fr.onloadend = function () { p.parse(fr.result, 8); }; //main entrypoint into the interpreter
            fr.readAsBinaryString(file);
        } else alert("fail");
    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);

});