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
//        console.log("CORS req. for : " + url.toString());
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
            "test_if.pyc", //good
            "test_for_loop.pyc", //good
            "test_while_loop.pyc", //good
            "test_list.pyc", //good
            "test_dict.pyc", //good
            "test_neg_numbers.pyc", //good
            "test_math.pyc", //good
            "test_fxn.pyc", //good
            "test_float.pyc", //good
            "test_tuple.pyc" //good
//            "test_fib.pyc" //TODO fails
        ];

        for (var i = 0; i < files.length; i++){
            var fullpath = prefix + files[i];
            var xhr = createCORSRequest('GET', fullpath);
            if (!xhr) {
                alert('CORS not supported');
                return;
            }

            xhr.onreadystatechange = (function (file, xmlHttpReq) {
                return function() {
                    var reader = new FileReader();
                    if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
                        reader.onloadend = function() {
                            if (reader.readyState == 2) {
//                                console.log("got response.");
//                                console.log(typeof reader.result);
                                var data = reader.result;
//                                console.log("data: " + data.toString());
//                                console.log("data len: " + data.byteLength + " bytes");
                                var result = tsuite.test(file, data);
                                if (result != undefined) {
                                    if (result == 0) {
//                                        console.log("done.");
                                        document.getElementById("results").innerHTML += '<p class="pass">PASSED: ' + file + '</p>';
                                    } else {
                                        document.getElementById("results").innerHTML += '<p class="fail">FAILED: ' + file + '</p>';
                                    }
                                } else {
                                    document.getElementById("results").innerHTML += '<p class="fail">FAILED: ' + file + '</p>';
                                }
                            } else {
                                //do nothing
                            }
                        };
                        reader.onerror = function(){ throw new Error("FileReader error."); };
//                        console.log("xmlHttpReq response: " + xmlHttpReq.response.toString());
                        reader.readAsArrayBuffer(xmlHttpReq.response);
                    } else if (xmlHttpReq.readyState == 4 && xmlHttpReq.status != 200) {
                        throw new Error("status code 200");
                    }
                }
            })(fullpath, xhr);

            xhr.responseType = "blob";
            xhr.send();
        }
    }

    makeCorsRequest();
});


