const express = require('express');
const router = express.Router();

const { create, update, remove, list, readCategory, categoryById } = require('../controllers/category');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/category/:categoryId', readCategory)
router.get('/categories', list)
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('userId', userById);
router.param('categoryId', categoryById);


module.exports = router;
