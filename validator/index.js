exports.signupValidator = (req, res, next) => {
  req.check('name', 'Name cannot be empty').notEmpty();
  req.check('email', 'email cannot be empty').notEmpty();
  req.check('email', 'That email format is not accepted')
      .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
        .withMessage('Ensure you properly typed in your email!')
  req.check('password', 'password is required').notEmpty();
  req.check('password')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/, "i")
      .withMessage('Password must be atleast 6 characters, contain a number and a symbol');

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map( (error) => error.msg )[0];
    return res.status(400).json({ error : firstError});
  }
  next();
};
