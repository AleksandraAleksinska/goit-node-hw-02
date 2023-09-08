const service = require('../service/users');
const validation = require('../models/validation');
const bcrypt = require('bcryptjs');


const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

const register = async (req, res, next) => {
    const { email, password } = req.body;
    const newUserValidation = validation.userSchema.validate(req.body);
    if (newUserValidation.error){
        return res.status(400).json({
            status: "fail",
            message: "Invalid data",
            error: newUserValidation.error,
        });
    }
    try {
        const user = await service.getUserByEmail(req.body.email);
        if(user) {
            return res.status(409).json({
				status: "fail",
				code: 409,
				message: "Email in use",
			});
        }
        const hashedPassword = await hashPassword(password);
        const result = await service.registerUser({ email, password: hashedPassword });
        res.status(201).json({ result });
    } catch (e) {
        console.error(e);
        next(e);
    }
}

module.exports = {
    register,
    hashPassword,
}