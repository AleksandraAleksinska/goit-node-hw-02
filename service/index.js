const Contact = require('./schemas/contact');

const getAllContacts = async() => {
    return Contact.find();
};

const getContactById = (id) => {
    return Contact.findOne({_id: id});
};

const createContact = ({ name, email, phone }) => {
    return Contact.create({ name, email, phone });
};

const updateContact = (id, fields) => {
    return Contact.findOneAndUpdate(
        { _id: id },
        { $set: fields },
        { new: true }
    );
};

const removeContact = (id) => {
    return Contact.findByIdAndRemove({ _id: id });
};


module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    removeContact
}