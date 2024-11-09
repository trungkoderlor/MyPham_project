const express = require("express");
const router = express.Router();
const validate = require("../../validates/admin/auth.validate")
const Controller = require("../../controllers/admin/auth.controller");

router.get('/login',Controller.login) ;
router.post(
  '/login',
  validate.createPost
  ,Controller.loginPost) ;
  router.get('/logout',Controller.logout) ;
module.exports = router;