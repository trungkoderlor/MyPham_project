const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/client/product.controller");

router.get('/',Controller.index) ;
module.exports = router;