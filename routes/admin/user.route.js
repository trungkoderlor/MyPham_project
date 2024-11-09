const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/user.controller");

router.get('/',Controller.index) ;
router.patch('/change-status/:status/:id', Controller.changeStatus);
router.delete('/delete/:id', Controller.delete);
router.get('/trash', Controller.trash);
router.patch('/trash/restore/:id', Controller.restore);
router.delete('/trash/delete/:id', Controller.trashDelete);
router.get('/detail/:id', Controller.detail);
module.exports = router;