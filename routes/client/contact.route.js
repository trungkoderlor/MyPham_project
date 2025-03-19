const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/client/contact.controller");
const ContactValidate = require("../../validates/client/contact.validate");
router.get('/',Controller.index) ;
router.post('/',ContactValidate.ContactPost,Controller.PostLetter) ;

module.exports = router;