const express = require('express');
const router = express.Router();
const paramController = require('../controller/param.controller');
const {verifyAdmin} = require("../auth.service");

router.get('/', paramController.getAll);
router.get('/:id', paramController.getOne);
router.post('/', verifyAdmin, paramController.create);
router.put('/:id', verifyAdmin, paramController.update);
router.delete('/:id', verifyAdmin, paramController.remove);
router.get('/key/:key', paramController.getValueByKey);


module.exports = router;
