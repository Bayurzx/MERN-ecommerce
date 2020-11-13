const mongoose = require('mongoose');
const crypto = require('crypto');

const categorySchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    maxlength : 64,
    trim : true
  }
},

{timestamps: true}

);


module.exports = mongoose.model('Category', categorySchema);
