const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = (req, res, next, id) => {
  Product.findById(id).populate('category').exec((err, product) => {
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
    // I added the try and catch block because of the "HTTP Header request already sent" error
    try {

      product.save((err, result) => {
        res.json(result);
      });

    } catch(err) {
      if (err) {
        return res.status(400).json({
          error : errorHandler(err)
        })
      }

    }

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

    // // Ensure all field are present
    // const { name, description, price, category, shipping, quantity, photo } = fields;
    //
    // if (!name || !description || !price || !category || !shipping || !quantity) {
    //   res.status(400).json({
    //     error : "All fields are required"
    //   });
    // }

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
          error : (err)
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

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  // params to grab 'products' props from db
  // /products?sortBy=sold&order=desc&limit=4
  // /products?sortBy=createdAt&order=desc&limit=4

  // the minus in the select parameter is to show exclude
  // popupalte method of mongoose is used to pick data from a different collection <check models>
  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, product) => {
      if (err){
        return res.status(400).json({
          error: err
        })
      }
      return res.json(product)
    })
}

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({
    _id: {$ne: req.product},
    category: req.product.category
  })
  .select('-photo')
  .limit(limit)
  .populate('category', 'id name')
  .exec((err, products) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    return res.json(products);
  });
}

exports.listCategories = (req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "Categories not found"
      })
    }
    return res.json(categories);
  });
}


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
          findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
          return res.status(400).json({
              error: "Products not found"
          });
      }
      res.json({
          size: data.length,
          data
      });
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next();
}

exports.listSearch = (req, res) => {
  // create query object to hold search value and category
  const query = {}
  // assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' }
    //assign category value to category.value
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
    // find the obkect based on query object with two properties
    // search and category
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }
      res.json(products)
    }).select("-photo")
  }
}

exports.updateQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne : {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } }
      }
    };
  })

  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      res.status(400).json({
        error: "Could not update the product quantity"
      })
    }
    next()
  })
}
