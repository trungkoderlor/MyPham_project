const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/order.controller");

router.get('/',Controller.index) ;
router.get('/detail/:id',Controller.detail) ;
router.post('/detail/:id/confirm',Controller.ConfirmStatus) ;
router.post('/detail/:id/confirmShipped',Controller.ConfirmShipped) ;
router.post('/detail/:id/processed',Controller.Processed) ;
module.exports = router;