const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to enerate signed jsonwebtoken
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler.js')

exports.signup = (req, res) => {
  console.log("req.body", req.body)
  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({ error : errorHandler(error) });
    }
    user.hashed_pw = undefined;
    user.salt = undefined;
    return res.json({ user });
  });

};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err : "User with this email doesn't exist. Please signup"
      });
    }
    // If the user exists, Create authenticate method in user model
    // Generate a signed token with user ID and secret


  })

}
