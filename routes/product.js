const express = require('express');
const router = express.Router();

// const { create } = require('../controllers/product');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { create, remove, productById, productRead, update, list, listSearch, listRelated, listCategories, listBySearch, photo } = require('../controllers/product');

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/product/:productId', productRead);
router.get('/products', list);
router.get('/products/search', listSearch);
router.get('/products/categories', listCategories);
router.get('/products/related/:productId', listRelated);
router.post("/products/by/search", listBySearch);
router.get('/product/photo/:productId', photo);


router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
