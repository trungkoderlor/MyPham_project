const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/role.controller");

router.get('/',Controller.index) ;
router.get('/create',Controller.create);
router.post('/create',Controller.createPost);
router.get('/edit/:id',Controller.edit);
router.get('/permissions',Controller.permissions);
router.patch('/permissions',Controller.permissionsPatch);
router.patch('/edit/:id',Controller.editPatch);

module.exports = router;