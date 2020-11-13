const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    maxlength : 64,
    trim : true
  },
  description : {
    type: String,
    required: true,
    maxlength : 2400,
    trim : true
  },
  price : {
    type: Number,
    required: true,
    maxlength : 32,
    trim : true
  },
  category : {
    type: ObjectId,
    ref: "Category",
    required : true
  },
  quantity : {
    type: Number,
  },
  photo : {
    data : Buffer,
    contentType : String
  },
  shipping : {
    required: false,
    type : Boolean
  },

},

{timestamps: true}

);


module.exports = mongoose.model('Product', productSchema);
