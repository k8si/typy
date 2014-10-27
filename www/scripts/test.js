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
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.setRequestHeader('origin', 'me');
        } else if (typeof XDomainRequest != "undefined") {
            console.log("XDomainRequest undefined");
            xhr = new XDomainRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.setRequestHeader('origin', 'me');
        } else {
            xhr = null;
        }
        return xhr;
    }

    function makeCorsRequest() {
        var prefix = "http://localhost:3000/data/";
        var files = [
            "test_if.pyc",
            "test_for_loop.pyc",
            "test_while_loop.pyc",
            "test_list.pyc",
            "test_dict.pyc",
            "test_neg_numbers.pyc",
            "test_math.pyc",
            "test_fxn.pyc"
        ];

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
                        var result = tsuite.test(f, hr.response);
                        if (result != undefined) {
                            if (result == 0) {
                                console.log("done.");
                                document.getElementById("output").innerHTML += '<p class="pass">PASSED: ' + f + '</p>';
                            } else {
                                document.getElementById("output").innerHTML += '<p class="fail">FAILED: ' + f + '</p>';
                            }
                        } else {
                            document.getElementById("output").innerHTML += '<p class="fail">FAILED: ' + f + '</p>';
                        }
                    }
                };
            })(fullpath, xhr);
            xhr.responseType = "arraybuffer";
            xhr.send();
        }
    }

    makeCorsRequest();
});


