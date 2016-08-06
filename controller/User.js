
var mongoose = require('mongoose')
var UserDetail = mongoose.model('User', require('../model/User'));


exports.list = function(req, res, next) {
    UserDetail.find().exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
            res.json(subevnts);
        }
    });
};

exports.create = function(req, res, next) {
    var saveop = new UserDetail(req.body);
    saveop.save(function(err) {
        if (err) {
            console.log(err)
            return next(err);
        } else {
            res.json(saveop);
        }
    });
};
