const express = require('express');
const router = express.Router();

// const { create } = require('../controllers/product');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { create, remove, productById, productRead, update } = require('../controllers/product');

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/product/:productId', productRead);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
