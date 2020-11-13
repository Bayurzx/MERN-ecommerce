const mongoose = require('mongoose');
const crypto = require('crypto');
// Note that uuidv1 is not very secure and can be hacked read more here
// https://stackoverflow.com/questions/20342058/which-uuid-version-to-use
const { v1 : uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    maxlength : 64,
    trim : true
  },

  email : {
    type: String,
    required: true,
    unique : true,
    trim : true
  },

  hashed_pw : {
    type: String,
    required: true,
  },

  about : {
    type: String,
    trim : true
  },

  salt : String,

  role : {
    type: Number,
    default : 0
  },

  history : {
    type: Array,
    default : []
  },

},

{timestamps: true}

);

//Virtuals
userSchema.virtual('password')
  .set(function (password){
    this._password = password
    this.salt = uuidv1()
    this.hashed_pw = this.encryptPassword(password)
  })
  .get(function (){
    return this._password
  })

userSchema.methods = {
  authenticate : function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_pw;
  },

  encryptPassword : function(password){
    if (!password) return "";

    try {
      return crypto.createHmac('sha1', this.salt)
                      .update(password)
                        .digest('hex')
    } catch (e) {
        return ''
    }
  }
}

module.exports = mongoose.model('User', userSchema);
