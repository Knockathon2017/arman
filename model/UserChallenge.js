var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
var UserChallengeSchema = new Schema({

	name: {
		type: String
	},

	geo_location: {
		lat: {
			type: Number
		},

		lon: {
			type: Number
		}
	},

	username: {
		type: String
		
	},

	challenge_accepted: {
		type: Boolean,
		default: false
	},

	challenge_completed: {
		type: Boolean,
		default: false
	},

	challenge_uploaded_file: {
		type: String
	},


	created_date: {
		type: Date,
		default: Date.now
	},

	updated_date: {
		type: Date
	}
 });


UserChallengeSchema.pre('save', function(next){
  now = new Date();
  this.updated_date = now;
  if ( !this.created_date ) {
    this.created_date = now;
  }
  next();
});


mongoose.model('UserChallenge', UserChallengeSchema);

