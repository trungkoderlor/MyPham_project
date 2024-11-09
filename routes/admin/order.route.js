const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/order.controller");

router.get('/',Controller.index) ;
router.get('/detail/:id',Controller.detail) ;
module.exports = router;