const express = require("express");
const router = express.Router();
const storageHelper = require("../../helpers/storageMulter");
const multer  = require('multer')
const upload = multer({ storage: storageHelper() });
const Controller = require("../../controllers/admin/user.controller");
const validate = require("../../validates/admin/account.validate");
router.get('/',Controller.index) ;
router.patch('/change-status/:status/:id', Controller.changeStatus);
router.delete('/delete/:id', Controller.delete);
router.get('/trash', Controller.trash);
router.patch('/trash/restore/:id', Controller.restore);
router.delete('/trash/delete/:id', Controller.trashDelete);
router.get('/detail/:id', Controller.detail);
router.get('/create',Controller.create);
router.post('/create',validate.createPost,upload.single('avatar'),Controller.createPost);
router.get('/edit/:id',Controller.edit);
router.patch('/edit/:id',validate.createPost,upload.single('avatar'),Controller.editPatch);

module.exports = router;