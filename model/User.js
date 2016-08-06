var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');


var UserSchema = new Schema({   
    firstName: {
        type : String,
        trim: true
    },
    lastName: {
        type : String,
        trim: true
    },
    email: {
        type : String,
        trim: true,
        match: /.+\@.+\..+/
    },
    username: {
        type : String,
        trim: true,
        unique:true,
        required:true
    },

    
    loc: {
            type: { type: String, default:'Point' },
    coordinates: { type: [Number], index: '2dsphere'}
  },
   
    created: {
        type: Date,
        default: Date.now
    },

    userfile: { type: Schema.Types.ObjectId, ref: 'UserFile' }
    


    
});

mongoose.model('User', UserSchema);

module.exports = UserSchema;