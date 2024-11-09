const express = require("express");
const router = express.Router();
const storageHelper = require("../../helpers/storageMulter");
const multer  = require('multer')
const upload = multer({ storage: storageHelper() });
const Controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate")
router.get('/', Controller.index);
router.patch('/change-status/:status/:id', Controller.changeStatus);
router.patch('/change-multi', Controller.changeMulti);
router.delete('/delete/:id', Controller.deleteItem);
router.get('/create', Controller.create);

router.post('/create',
    upload.single("thumbnail"),
    validate.createPost,
    Controller.createPost);
router.get('/edit/:id', Controller.edit);
router.get('/detail/:id', Controller.detail);
router.patch('/edit/:id',
    upload.single("thumbnail"),
    validate.createPost,
    Controller.editPatch);
router.get('/trash', Controller.trash);
router.delete('/trash/delete/:id', Controller.deleteTrash);
router.patch('/trash/restore/:id', Controller.restore);
module.exports = router;
