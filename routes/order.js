const express = require('express');
const router = express.Router();

const { isAuth, requireSignin, isAdmin } = require('../controllers/auth');
const { userById, addOrderToUserHistory } = require('../controllers/user');
const { createOrder, listOrders, getStatusValues, updateOrderStatus, orderById } = require('../controllers/order');
const { updateQuantity } = require('../controllers/product');

router.post('/order/create/:userId', requireSignin, isAuth, addOrderToUserHistory, updateQuantity, createOrder);

router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders);
router.get('/order/status-values/:userId', requireSignin, isAuth, isAdmin, getStatusValues);
router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus);

router.param('userId', userById)
router.param('orderId', orderById)

module.exports = router;
