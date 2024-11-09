const express = require('express');
const router= express.Router();
const Controller = require("../../controllers/admin/category.controller");
const storageHelper = require("../../helpers/storageMulter");
const multer  = require('multer')
const upload = multer({ storage: storageHelper() });
const validate = require("../../validates/admin/category.validate")
router.get('/',Controller.index);
router.get('/create',Controller.create);
router.post('/create',
  upload.single("thumbnail"),
  validate.createPost,
  Controller.createPost);
router.patch('/change-status/:status/:id',Controller.changeStatus);
router.patch('/change-multi',Controller.changeMulti);
router.get('/edit/:id',Controller.edit);
router.patch('/edit/:id',
  upload.single("thumbnail"),
  validate.createPost,
  Controller.editPatch);
router.delete('/delete/:id',Controller.deleteItem);
router.get('/trash',Controller.trash);
router.delete('/trash/delete/:id',Controller.deleteTrash);
router.patch('/trash/restore/:id',Controller.restore);
module.exports = router;
