var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
var UserPointsSchema = new Schema({

	username: {
		type: String,
		trim: true,
        
        required:true
	},

	points: {
		type: Number,
		required: true
	},

	last_point_added: {

		type: Number
	},

	created_date: {
		type: Date,
		default: Date.now
	},

	last_updated_date: {
		type: Date
	}

 });

UserPointsSchema.pre('save', function(next){
  now = new Date();
  this.last_updated_date = now;
  if ( !this.created_date ) {
    this.created_date = now;
  }
  next();
});

mongoose.model('UserPoints', UserPointsSchema);

module.exports = UserPointsSchema;
