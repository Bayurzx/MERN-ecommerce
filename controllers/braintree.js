const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();

const gateway = new braintree.BraintreeGateway({
    environment:  braintree.Environment.Sandbox,
    merchantId:   process.env.BRAINTREE_MERCHANT_ID,
    publicKey:    process.env.BRAINTREE_PUBLIC_KEY,
    privateKey:   process.env.BRAINTREE_PRIVATE_KEY
});

exports.generateToken = (req, res) => {
  gateway.clientToken.generate({}, function(err, response) {
    if (err) {
      res.status(500).send(err);
      console.log("braintree_err", err)
    } else {
      res.send(response);
    }
  })
}

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheCLient = req.body.amount;
  //charge
  let newTransaction = gateway.transaction.sale({
    amount : amountFromTheCLient,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, (error, response) => {
    if (error) {
      res.status(500).json(error);
      console.log("braintree_err", error)
    } else {
      res.json(response);
    }
  })
}
