const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/chat.controller");

router.get('/:roomId',Controller.index) ;
module.exports = router;