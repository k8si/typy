/**
 * Created by kate on 10/8/14.
 */

//FIXME this may not work on Windows

import parse = require('./parse');
import fs = require('fs');
import path = require('path');


var f = fs.realpathSync("../630-proj1/pyc/iter_test.pyc");

var parser = new parse.Parser(f);
parser.parse(8);



