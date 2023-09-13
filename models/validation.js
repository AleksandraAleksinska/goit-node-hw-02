const Joi = require('joi');
const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'pl'] } }).required(),
    phone: Joi.number().required()
});

const contactSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	phone: Joi.string().required(),
});
const updateContactSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'pl'] } }).required(),
	phone: Joi.string(),
});

const updateFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

const userSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

module.exports = {
    schema,
    contactSchema,
    updateContactSchema,
    updateFavoriteSchema,
    userSchema,
}; 