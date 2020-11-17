const User = require('../models/user');

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
  req.profile.hashed_password = undefined;
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
      req.profile.hashed_password = undefined;
      return res.json(user);
    }
  )
}
