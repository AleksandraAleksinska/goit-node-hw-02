const Joi = require('joi');
const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'pl'] } }).required(),
    phone: Joi.number().required()
});

module.exports = schema; 