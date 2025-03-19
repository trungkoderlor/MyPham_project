const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/review.controller");

router.get('/',Controller.index) ;
router.get('/detail/:id',Controller.detail) ;
module.exports = router;