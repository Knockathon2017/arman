var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
var UserFileSchema = new Schema({

	username: {
		type: String,
		trim: true,
		unique:true,
        required:true		
	},

	file: {
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

	created_date: {
		type: Date,
		default: Date.now

	},

	updated_date: {
		type: Date
	}

 });

UserFileSchema.pre('save', function(next){
  now = new Date();
  this.updated_date = now;
  if ( !this.created_date ) {
    this.created_date = now;
  }
  next();
});


mongoose.model('UserFile', UserFileSchema);