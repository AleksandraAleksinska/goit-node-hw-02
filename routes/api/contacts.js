const express = require('express');
const router = express.Router();
const ctrlContacts = require('../../controller/index');

router.get('/', ctrlContacts.get);
router.get('/:contactId', ctrlContacts.getById);
router.post('/contacts', ctrlContacts.create);
router.put('/:contactId', ctrlContacts.update);
router.delete('/:contactId', ctrlContacts.remove);
router.patch('/:contactId/favorite', ctrlContacts.updateFavorite);


module.exports = router
