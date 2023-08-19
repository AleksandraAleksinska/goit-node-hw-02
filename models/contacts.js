const fs = require('fs').promises;
const { writeFile } = require('fs');
const path = require('path'); 
const {nanoid} = require("nanoid");

const contactsPath = path.join(__dirname, 'contacts.json')


const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contactById = contacts.find((contact) => contact.id === contactId);
  return contactById ? contactById : null;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactsAfterRemoval = contacts.filter((contact) => contact.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(contactsAfterRemoval, 2, null));
  return contactsAfterRemoval;
  }

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), ...body };
  const contactsAfterAdding = [...contacts, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(contactsAfterAdding, 2, null));
  return newContact;
}

const updateContact = async (contactId, body) => {

  const contacts = await listContacts();
  const updatingContactIndex = contacts.findIndex((contact) => contact.id === contactId);

  if (updatingContactIndex === -1) {
    return null;
  }
  const updatedContact= {
    ...contacts[updatingContactIndex], ...body
  }

  await fs.writeFile(contactsPath, JSON.stringify(contacts, 2, null))
  return updatedContact;
  
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
