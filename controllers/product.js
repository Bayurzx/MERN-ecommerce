const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error : "Product not found"
      });
    }
    req.product = product;
    next();
  });
}

exports.productRead = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtension = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({
        error: "Image could not be uploaded!"
      })
    }

    // Ensure all field are present
    const { name, description, price, category, shipping, quantity, photo } = fields;

    if (!name || !description || !price || !category || !shipping || !quantity) {
      res.status(400).json({
        error : "All fields are required"
      });
    }

    let product = new Product(fields)

    if (files.photo) {
      // console.log("file.photo", files.photo);
      if (files.photo.size > 3145728) {
        return res.status(400).json({
          error : "The image size shouldn't be largerr than 3mb"
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error : errorHandler(err)
        })
      }
      res.json(result);
    });
  });
};

// update the products from here
exports.update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtension = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({
        error: "Image could not be uploaded!"
      })
    }

    // Ensure all field are present
    const { name, description, price, category, shipping, quantity, photo } = fields;

    if (!name || !description || !price || !category || !shipping || !quantity) {
      res.status(400).json({
        error : "All fields are required"
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      // console.log("file.photo", files.photo);
      if (files.photo.size > 3145728) {
        return res.status(400).json({
          error : "The image size shouldn't be largerr than 3mb"
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error : errorHandler(err)
        })
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let product =  req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error : errorHandler(err)
      });
    }
    res.json({
      message:"Product deleted successfully"
    })
  })
}
