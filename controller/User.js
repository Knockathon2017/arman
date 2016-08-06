
var mongoose = require('mongoose')
var UserDetail = mongoose.model('User', require('../model/User'));
var UserFile = mongoose.model('UserFile', require('../model/UserFile'));
var Location = mongoose.model('Location', require('../model/Location'));
var Points = mongoose.model('UserPoints', require('../model/UserPoints'));



exports.postUserPoint = function(req, res, next) {

	var saveop = new Points(req.body);
	saveop.save(function(err) {
		if(err){
			return next(err);
		} else {
			res.json(saveop);
		}
	});
};

exports.getUserPoint = function(req, res, next) {

	Points.find({username: req.params.username}).exec(function(err, points) {
		if(err) {
			return next(err);
		} else {
			res.json(points);
		}
	});
};


exports.locationList = function(req, res, next) {
	Location.find().populate('Location').exec(function(err, location) {
		if(err) {
			return next(err);
		} else {
			res.json(location)
		}
	});
};

exports.list = function(req, res, next) {
	var json ={};
    UserDetail.find().populate('UserFile').exec(function(err, subevnts) {
        if (err) {
            return next(err);
        } else {
        	
        	res.json(subevnts);
            
        }
    });
};

exports.userFile = function(req, res, next) {

console.log(req.params.username)
	UserFile.find({username : req.params.username}).exec(function(err, file) {
		 if (err || file == null) {
			response = {"error" :404, "message": "user not found."}
			res.json(response)
        } else {
        	console.log(file)
        	res.json(file);
            
        }
	});

};

exports.userFileCreate = function(req, res, next) {

	var saveuserfile = new UserFile(req.body);
	saveuserfile.save(function(err) {
		if(err){
			return next(err);
		} else {
			res.json(saveuserfile)
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
			if(req.body.userfile !== undefined){
				user.userFile
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
