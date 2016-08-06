var express = require('express')
  , router = express.Router()

router.post('/upload', function(req, res) {

});

module.exports = router



var Multer = require('multer')
var Fs = require("fs")

var storage = Multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'tmp');
    },

    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }

});

var upload = Multer({
    storage: storage,
    limits: {
        "fileSize": Config.fileSize * 1024 * 1024 /* size in mb */
    },
    fileFilter: function(req, file, cb) {
        var validFileTypes = /(image|jpe?g|gif|png|")/;

        if (Security.isAuthorizedRequest(req, true) && !AppUtil.isInlineImage(file)) {
            if (validFileTypes.test(file.mimetype))
                cb(null, true);
            else
                cb(null, false);
        } else {
            cb(null, false);
        }
    }
});