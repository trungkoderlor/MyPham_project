const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/letter.controller");

router.get('/',Controller.index) ;
router.get('/detail/:id',Controller.detail) ;
router.post('/detail/:id',Controller.reply) ;
router.delete('/delete/:id', Controller.delete);
router.get('/trash', Controller.trash);
router.patch('/trash/restore/:id', Controller.restore);
router.delete('/trash/delete/:id', Controller.trashDelete);
module.exports = router;