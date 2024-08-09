const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  quantity: {
    type: Number,
    required:true
  },

  expirationDate: {
    type:Date,
    required:true
  },
  photo:{
    type:String,
    default:"uploads/default.jpg"
  },
  category:{
    type:mongoose.Schema.ObjectId,
    ref:"Category",
    required: [true, 'Product must be belong to category']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
