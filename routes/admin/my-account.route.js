const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/my-account.controller");

router.get('/',Controller.index) ;
module.exports = router;