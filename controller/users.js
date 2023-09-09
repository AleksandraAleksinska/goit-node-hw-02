const service = require('../service/users');
const validation = require('../models/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


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

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const loginValidation = validation.userSchema.validate(req.body);
    if (loginValidation.error){
        return res.status(400).json({
            status: "fail",
            message: "Invalid data",
            error: loginValidation.error,
        });
    }
    try {
        const user = await service.getUserByEmail(email);
        
        if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
                if (err || !result) {
                    return res.status(400).json({                
                        message: "Email or password is wrong",  
                    });
                } else {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            _id: user._id,
                        },
                        process.env.SECRET_KEY,
                        { expiresIn: "1h" }
                    );
                    return res.status(200).json({
                        "token": token ,
                        "user": {
                            "email": `${user.email}`,
                            "subscription": "starter"
                        }
                    });
                }
            });
        } else {
            return res.status(400).json({                
                message: "Email or password is wrong",  
            });
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
}


module.exports = {
    register,
    hashPassword,
    login,
}