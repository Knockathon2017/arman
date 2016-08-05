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

	location_latLon : {
		lat: {
			type: String
		},
		lon: {
			type: String
		}
	},

	location_image: {
		type: String
	},

	created_date: {
		type: Date
	},

	updated_date: {
		type: Date
	}

});

Location.set('toJSON', {
    getters: true,
    virtuals: true
});
mongoose.model('Location', LocationSchema);