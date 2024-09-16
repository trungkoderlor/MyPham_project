const express = require("express"); 
const router = express.Router();
const Controller = require("../../controllers/client/home.controller");
router.get('/',Controller.index) ;
module.exports = router;