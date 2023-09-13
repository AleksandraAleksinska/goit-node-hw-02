const express = require('express');
const router = express.Router();
const ctrlContacts = require('../../controller/contacts');

router.get('/contacts', ctrlContacts.get);
router.get('/contacts/:contactId', ctrlContacts.getById);
router.post('/contacts', ctrlContacts.create);
router.put('/contacts/:contactId', ctrlContacts.update);
router.delete('/contacts/:contactId', ctrlContacts.remove);
router.patch('/contacts/:contactId/favorite', ctrlContacts.updateFavorite);


module.exports = router
