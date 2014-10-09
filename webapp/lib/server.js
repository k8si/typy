/**
 * Created by kate on 10/9/14.
 */

var sys = require("sys");
var http = require("http");
var path = require("path");
var url = require("url");
var fs = require("fs");

http.createServer(function (req, res) {
    sys.puts("received request");
    sys.puts(req.toString());
    sys.puts(req.url);
//    for (i in req) {
//        sys.puts(i.toString());
//    }
    res.writeHeader(200, {"Content-Type": "text/plain"});
    res.write("hello world");
    res.end();
}).listen(1337);
sys.puts("server up on 1337");