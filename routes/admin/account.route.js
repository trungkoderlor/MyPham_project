const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/account.controller");
const storageHelper = require("../../helpers/storageMulter");
const multer  = require('multer')
const upload = multer({ storage: storageHelper() });


const validate = require("../../validates/admin/account.validate")
router.get('/',Controller.index) ;
router.get('/create',Controller.create) ;
router.post(
    '/create',
    upload.single("avatar"),
    validate.createPost,
    Controller.createPost
) ;
router.patch('/change-status/:status/:id', Controller.changeStatus);
router.delete('/delete/:id', Controller.deleteItem);
router.get('/trash', Controller.trash);
router.delete('/trash/delete/:id', Controller.trashDelete);
router.patch('/trash/restore/:id', Controller.restore);
router.get('/detail/:id', Controller.detail);
router.get('/edit/:id', Controller.edit);
router.patch('/edit/:id',
    validate.createPost,
    upload.single("avatar"),
     Controller.editPatch);
module.exports = router;