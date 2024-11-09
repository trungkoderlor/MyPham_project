const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/setting.controller");
const storageHelper = require("../../helpers/storageMulter");
const multer  = require('multer')
const upload = multer({ storage: storageHelper() });
router.get('/general',Controller.general) ;
router.patch(
  '/general',
  upload.single("logo"),
  Controller.generalPatch) ;
module.exports = router;