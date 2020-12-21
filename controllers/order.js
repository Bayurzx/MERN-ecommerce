const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.createOrder = (req, res) => {
  // console.log('Create order req.body', req.body)
  req.body.order.user = req.profile;
  const order = new Order(req.body.order)
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error : errorHandler(error)
      })
    } else {
      return res.json(data);
    }
  })
};

exports.listOrders = (req, res) => {
  Order.find()
  .populate('user', '_id name address') // 2nd props is to choose populated
  .sort('-created')
  .exec((error, orders) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }
    res.json(orders);
  });
}

exports.getStatusValues = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
}

exports.orderById = (req, res, next, id) => {
  Order.findById(id)
  .populate('products.product', 'name price')
  .exec((error, order) => {
    if (error || !order) {
      res.status(400).json({
        error: errorHandler(error)
      });
    }
    req.order = order
    next();
  })
}

exports.updateOrderStatus = (req, res) => {
  Order.update(
    {_id: req.body.orderId },
    {$set: {status: req.body.status} },
    (error, order) => {
      if (error) {
        res.status(400).json({
          error: errorHandler(error)
        });
      }
      res.json(order);
    }
  )
}
