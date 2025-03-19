const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/admin/brand.controller');

router.get('/', Controller.index);
router.get('/create', Controller.create);
router.post('/create', Controller.createPost);
router.get('/edit/:id', Controller.edit);
router.patch('/edit/:id', Controller.editPatch);
router.delete('/delete/:id', Controller.delete);
router.get('/detail/:id', Controller.detail);
router.patch('/change-status/:status/:id', Controller.changeStatus);
router.patch('/change-multi', Controller.changeMulti);
module.exports = router;
