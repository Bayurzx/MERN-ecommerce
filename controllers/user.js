const User = require('../models/user');
const {Order} = require('../models/order');

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user){
      res.status(400).json({
        error: "User not found"
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_pw = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);

};

exports.update = (req, res) => {
  User.findOneAndUpdate(
    {_id: req.profile._id},
    {$set: req.body},
    {new: true},
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error : "You are not authorized to perform action"
        })
      }
      req.profile.salt = undefined;
      req.profile.hashed_pw = undefined;
      // plugged a security issue here 🥂
      user.salt = undefined;
      user.hashed_pw = undefined;
      return res.json(user);
    }
  )
}

exports.addOrderToUserHistory = (req, res, next) => {
  let history = []

  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount
    })
  })

  User.findOneAndUpdate(
    {_id: req.profile._id},
    {$push: {history: history}},
    {new: true},
    (error, data) => {
      if (error) {
        res.status(400).json({
          error: "Could not update user purchase history"
        });
      }
      next();
    }
  );
}

exports.purchaseHistory = (req, res) => {
  Order.find({user: req.profile._id})
  .populate('user', '_id name')
  .sort('-created')
  .exec((error, orders) => {
    if (error) {
      res.status(400).json({ error: error });
    }
    res.json(orders);
  })
}
