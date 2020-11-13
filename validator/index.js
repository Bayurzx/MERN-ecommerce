// To check a password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter
var passwd1 = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
// To check a password between 7 to 15 characters which contain at least one numeric digit and a special character
var passwd2 = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
// To check a password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
var passwd3 = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;


exports.signupValidator = (req, res, next) => {
  req.check('name', 'Name cannot be empty').notEmpty();
  req.check('email', 'email cannot be empty').notEmpty();
  req.check('email', 'That email format is not accepted')
      .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
        .withMessage('Ensure you properly typed in your email!')
  req.check('password', 'password is required').notEmpty();
  req.check('password')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
      .withMessage('Password must be atleast 6 characters, contain a number and a symbol');

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map( (error) => error.msg )[0];
    return res.status(400).json({ error : firstError});
  }
  next();
};
