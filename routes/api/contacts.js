const express = require('express');
const router = express.Router();
const schema = require('../../models/validation')

const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../../models/contacts');


router.get('/', async (req, res, next) => {
	const contacts = await listContacts();
  res.status(200).json(contacts);
})

router.get('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  const contactById = await getContactById(id);
  if (contactById) {
    res.status(200).json(contactById)
  } else {
    res.status(404).json({ message: 'Not found'});
  }
})

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body;
  const contact = {
    name,
    email,
    phone,
  };

  const validation = schema.validate(contact); 
  if (validation.error) {
    const errorMessage = `missing required ${validation.error.details.map(detail => detail.context.key)} - field`
    return res.status(400).json({ message: errorMessage });
  }
  
  try {
    const contactToAdd = await addContact(contact);
    res.status(201).json(contactToAdd);
  }
  catch (error) {
    return res.status(500).json({ message: 'Ooops, something went wrong' });
  }
})

router.delete('/:contactId', async (req, res, next) => {  
  const id = req.params.contactId;
  const contactToRemove = await removeContact(id);
  
  if (contactToRemove) {
    res.status(200).json( { message: 'contact deleted' })
  } else {
    res.status(404).json({ message: 'Not found'})
  }

})

router.put('/:contactId', async (req, res, next) => {
  
  const { name, email, phone } = req.body;
  const contact = {
    name,
    email,
    phone,
  };

  const validation = schema.validate(contact); 
  if (validation.error) {
    return res.status(400).json({ message: 'missing fields' });
  }
  
  try {
    const { contactId } = req.params
    const updatedContact = await updateContact(contactId, contact);
    res.status(201).json(updatedContact);
  }
  catch (error) {
    return res.status(404).json({ message: 'Not found' });
  }
})


module.exports = router
