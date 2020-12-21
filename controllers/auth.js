const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to enerate signed jsonwebtoken
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler.js')

exports.signup = (req, res) => {
  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({ error : errorHandler(error) });
    }
    //remove sensitive info from frontend!
    user.hashed_pw = undefined;
    user.salt = undefined;
    return res.json({ user });
  });

};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error : "User with this email doesn't exist. Please signup"
      });
    }
    // If the user exists, authenticate, Created authenticate method in user model
    if (!user.authenticate(password)){
      return res.status(401).json(
          { error : "Email and/or password dooesn't match" }
        )
    }

    // destructire the user.values form user
    const { _id, name, email, role } = user;

    // Generate a signed token with user ID and secret
    const token = jwt.sign({_id: _id}, process.env.JWT_SECRET);

    // persist the tokem as 't' in cookie with expirry date
    res.cookie('t', token, { expire : new Date() + 9999 });

    // return response with user and token to frontend client
    return res.json({ token, user : { _id, name, email, role } });

  });

}

exports.signout = (req, res) => {
  res.clearCookie('t')
  res.json({message: "Signout successful"})
}

exports.requireSignin = expressJwt({
  secret : process.env.JWT_SECRET,
  algorithms : ["HS256"],
  userProperty : "auth"
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json(
      { error : "Access denied" }
    );
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error : "Accessible only to admins"
    });
  }
  next();
};
