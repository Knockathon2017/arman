var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
var LocationSchema = new Schema({

	location_name: {
		type: String,
		trim: true
	},
	
	location_address: {
		type: String
	},

	loc: {
            type: { type: String, default:'Point' },
    		coordinates: { type: [Number], index: '2dsphere'}
  	},

	location_image: {
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

LocationSchema.pre('save', function(next){
  now = new Date();
  this.updated_date = now;
  if ( !this.created_date ) {
    this.created_date = now;
  }
  next();
});
mongoose.model('Location', LocationSchema);
module.exports = LocationSchema;