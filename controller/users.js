const service = require('../service/users');
const validation = require('../models/validation');
require('dotenv').config();


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
    const user = await service.getUserByEmail(req.body.email);
        if(user) {
            return res.status(409).json({
				status: "fail",
				code: 409,
				message: "Email in use",
			});
        }
    try {      
        const hashedPassword = service.hashPassword(password);
        const user = await service.registerUser({ email, password: hashedPassword });        
        res.status(201).json({ user: {
            email: user.email,
            subscription: user.subscription
        } });
    } catch (e) {
        console.error(e);
        next(e);
    }
}

const login = async (req, res, next) => {
    const loginValidation = validation.userSchema.validate(req.body);
    if (loginValidation.error){
        return res.status(400).json({
            status: "fail",
            message: "Invalid data",
            error: loginValidation.error,
        });
    }
    try {
        const user = await service.loginUser(req.body);
		if (user) {
			res.status(200).json({ user	});
		} else {
			res.status(400).json({ message: "Incorrect login or password" });
		}
	} catch (e) {
        console.error(e);
        next(e);
    }
}

const logout = async (req, res, next) => {
	try {
		await service.logoutUSer(req._id);
		res.status(204)
	} catch (error) {
		next(error);
	}
};

const current = async (req, res, next) => {
	try {
		const { email, subscription } = req.user;
		res.status(200).json({ email, subscription });
	} catch (error) {
		next(error);
	}
};

module.exports = {
    register,
    login,
    logout,
    current
}