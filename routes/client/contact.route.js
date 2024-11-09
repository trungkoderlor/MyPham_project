const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/client/contact.controller");

router.get('/',Controller.index) ;
router.post('/',Controller.PostLetter) ;

module.exports = router;