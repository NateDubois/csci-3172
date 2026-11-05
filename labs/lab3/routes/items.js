const express = require('express');
const { getItems, getItem, createItem, deleteItem } = require('../controllers/itemsController');
const validateItem = require('../middleware/validateItem');

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', validateItem, createItem);
router.delete('/:id', deleteItem);

module.exports = router;