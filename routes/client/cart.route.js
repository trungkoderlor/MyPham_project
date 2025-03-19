const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/client/cart.controller");
const cartValidate = require("../../validates/client/cart.validate");
router.get('/',cartController.index) ;
router.get('/delete/:product_id',cartController.delete) ;
router.post('/add/:id',cartValidate.QuantityPost,cartController.addPost) ;
router.get('/update/:product_id/:quantity',cartValidate.QuantityGet,cartController.update) ;
module.exports = router;