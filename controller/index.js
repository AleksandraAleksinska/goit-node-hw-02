const service = require('../service');
const validation = require('../models/validation');

const get = async (req, res, next) => {
    try {
        const results = await service.getAllContacts();
        res.status(200).json(results);
    } catch (error) {
        console.error("Error reading file:", error.message);
        next(error);
    }
};

const getById = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const result = await service.getContactById(contactId);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: `Not found task id: ${id}` });
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
};

const create = async (req, res, next) => {
    const { name, email, phone } = req.body;
    const newContactValidation = validation.contactSchema.validate(req.body);
    if (newContactValidation.error) {
        return res.status(400).json({
            status: "fail",
            message: "Invalid data",
            error: newContactValidation.error,
        });
    }
    try {
        const result = await service.createContact({ name, email, phone });
        res.status(201).json({ result });
    } catch (e) {
        console.error(e);
        next(e);
    }
};

const update = async (req, res, next) => {
    const { name, email, phone } = req.body;
    const updateValidation = validation.updateContactSchema.validate(req.body);
    if (updateValidation.error) {
        return res.status(400).json({
            status: "fail",
            message: "Invalid data",
            error: updateValidation.error,
        });
    }
    try {
        const { contactId } = req.params;
        const result = await service.updateContact(contactId, { name, email, phone });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: `Not found task id: ${contactId}` });
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
};

const remove = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const result = await service.removeContact(contactId);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: `Not found task id: ${id}`,
                data: 'Not Found',
            });
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
};

const updateFavorite = async (req, res, next) => {
    const { contactId } = req.params;
    const { favorite = false } = req.body;
    const updateFavoriteValidation = validation.updateFavoriteSchema.validate(req.body);
    if (updateFavoriteValidation.error) {
        return res.status(400).json({
            status: "fail",
            message: "Invalid data",
            error: updateFavoriteValidation.error,
        });
    }
    try {
        const result = await service.updateContact(contactId, { favorite });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'missing field favorite' });
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
};

module.exports = {
    get,
    getById,
    create,
    update,
    remove,
    updateFavorite,
};
