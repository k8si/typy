/**
* Created by kate on 10/8/14.
*/
//FIXME this may not work on Windows
var parse = require('./parse');
var fs = require('fs');

var f = fs.realpathSync("../630-proj1/pyc/add.pyc");

var parser = new parse.Parser(f);
parser.parse(8);