const express = require("express");
const router = express.Router();
const checkoutController = require("../../controllers/client/checkout.controller");

router.get('/',checkoutController.index) ;

router.get('/success/:orderId',checkoutController.success) ;
router.post('/order',checkoutController.order) ;
module.exports = router;