const express = require('express');
const router = express.Router();
const Controller = require("../../controllers/client/brand.controller");
router.get('/:title',Controller.index) ;
module.exports = router;