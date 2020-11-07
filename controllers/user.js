const User = require('../models/user');

exports.signup = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({ error });
    }
    return res.json({ user });
  })

  res.json({
    message : "Hello there"
  });
};
