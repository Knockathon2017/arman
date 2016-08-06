
var mongoose = require('mongoose')
var UserDetail = mongoose.model('User', require('../model/User'));


exports.list = function(req, res, next) {
	console.log(req);
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

exports.read = function(req, res) {	
    res.json(res);
};

exports.update = function(req, res, next) {

	var response = {};
	
	UserDetail.findOne({username: req.params.username}).exec(function(err, user){
		if(err || user == null) {
			response = {"error" :404, "message": "user not found."}
			res.json(response)
		} else {

			console.log(req.body)
			console.log(user)
			if(req.body.lastname !== undefined){

				user.lastname = req.body.lastname;
			}
			if(req.body.email !== undefined) {
				user.email = req.body.email;
			}
			if(req.body.coordinates !== undefined) {
				user.coordinates = req.body.coordinates;
			}

			user.save(function(err){
				if(err) {
					response = {"error": 400, "message": err}
				} else {
					response = user;
				}
				res.json(response)
				
			});
		}
	
		
		
	});
};
