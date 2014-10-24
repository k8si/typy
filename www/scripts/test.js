//links:
//http://www.nczonline.net/blog/2012/05/31/working-with-files-in-javascript-part-4-object-urls/

BrowserFS.install(window);
var lsfs = new BrowserFS.FileSystem.LocalStorage();
BrowserFS.initialize(lsfs);

var fs = require('fs');

require(['tests/test_suite'], function(test_suite) {
    console.log("TyPy Test Suite");
    if (window.File && window.FileReader && window.FileList && window.Blob) console.log("FileReader suppported, good to go.");
    else alert('File APIs not supported');

    var tsuite = new test_suite.TestSuite();

    function createCORSRequest(method, url) {
        console.log("CORS req. for : " + url.toString());
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'text/plain');
            xhr.setRequestHeader('origin', 'me');
        } else if (typeof XDomainRequest != "undefined") {
            console.log("XDomainRequest undefined");
            xhr = new XDomainRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'text/plain');
            xhr.setRequestHeader('origin', 'me');
        } else {
            xhr = null;
        }
        return xhr;
    }

    function makeCorsRequest() {
        var prefix = "http://localhost:3000/data/";
        var files = ["test_if.pyc", "test_for_loop.pyc"];
//        var files = ["dummy.txt"];
        for (var i = 0; i < files.length; i++){
            var fullpath = prefix + files[i];
            var xhr = createCORSRequest('GET', fullpath);
            if (!xhr) {
                alert('CORS not supported');
                return;
            }

            xhr.onreadystatechange = (function (f, hr) {
                return function() {
                    console.log("xhr.onreadystatechange");
                    if (hr.readyState == 4 && hr.status == 200) {
                        console.log("response loaded");
                        var result = tsuite.test(f, hr.responseText);
                        if (result != undefined) {
                            console.log("done.");

                        }
                    } else {
                        //do nothing while we wait...
                    }
                };
            })(fullpath, xhr);
            xhr.send();
        }
    }

    makeCorsRequest();
});


