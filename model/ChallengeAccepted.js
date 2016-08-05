var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
var ChallengeAcceptedSchema = new Schema({


	challenge_name: {
		type: String
	},

	challenge_location: {
		type: String
	},

	challenge_geo: {
		lat: {
			type: Number
		},
		lon: {
			type: Number
		}
	},

	challenge_image: {
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


ChallengeAcceptedSchema.pre('save', function(next){
  now = new Date();
  this.updated_date = now;
  if ( !this.created_date ) {
    this.created_date = now;
  }
  next();
});


mongoose.model('ChallengeAccepted', ChallengeAcceptedSchema);