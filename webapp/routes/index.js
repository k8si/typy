var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var parse = require('../lib/parse');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'TyPy' });
});


router.route('/upload')
    .post(function(req, res) {
        console.log("POST received");
        console.log(req.body);
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function(fieldname, file, filename) {
            console.log("uploading: " + filename);
            fstream = fs.createWriteStream(__dirname + '/files/' + filename);
            file.pipe(fstream);
            fstream.on('close', function(){
                var parser = new parse.Parser(__dirname + '/files/' + filename);
                parser.parse(8);
                res.redirect('back');
            });
        });
    });

module.exports = router;
