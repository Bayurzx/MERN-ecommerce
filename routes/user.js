const express = require('express');
const router = express.Router();

const { signup, signin } = require('../controllers/user');
const { signupValidator } = require('../validator');

router.post('/signup', signupValidator, signup)
router.post('/signin', signup)

module.exports = router;
