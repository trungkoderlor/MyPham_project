const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/client/cart.controller");
router.get('/',cartController.index) ;
router.get('/delete/:product_id',cartController.delete) ;
router.post('/add/:id',cartController.addPost) ;
router.get('/update/:product_id/:quantity',cartController.update) ;
module.exports = router;