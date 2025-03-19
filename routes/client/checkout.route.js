const express = require("express");
const router = express.Router();
const checkoutController = require("../../controllers/client/checkout.controller");
const checkoutValidate = require("../../validates/client/checkout.validate");
router.get('/',checkoutController.index) ;

router.get('/success/:orderId',checkoutController.success) ;
router.post('/order',checkoutValidate.Checkout,checkoutController.order) ;
module.exports = router;