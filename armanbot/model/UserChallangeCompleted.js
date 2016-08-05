var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
var UserChallengeCompletedSchema = new Schema({

	username: {
		type: String,
		trim: true,
		unique:true,
        required:true	
	},

	location_detail: {
		type: String,
		required: true
	},

	created_date: {
		type: Date,
		default: Date.now
	},

	updated_date: {
		type: Date
	}
 });



UserChallengeCompletedSchema.pre('save', function(next){
  now = new Date();
  this.updated_date = now;
  if ( !this.created_date ) {
    this.created_date = now;
  }
  next();
});

mongoose.model('UserChallengeCompleted', UserChallengeCompletedSchema)