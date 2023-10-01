const service = require('../service/users');
const validation = require('../models/validation');
require('dotenv').config();
const Jimp = require("jimp");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');
const emailService = require('../service/email')



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
        const avatarURL = gravatar.url(req.body.email);
        const hashedPassword = service.hashPassword(password);
        const verificationToken = nanoid();
        const user = await service.registerUser({ email, password: hashedPassword, avatarURL, verificationToken }); 
        await emailService.sendVerificationEmail(user.email, user.verificationToken)     
        res.status(201).json({ user: {
            email: user.email,
            subscription: user.subscription,
            avatarURL,
            verificationToken
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
		if (user && user.verify) {
			res.status(200).json({ user	});
		} else {
			res.status(400).json({ message: "Incorrect login or password or user not verified" });
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

const updateAvatar = async (req, res, next) => {
    try {
        const file  = req.file;
        const avatar = await Jimp.read(file.path);
        
        await avatar.cover(250, 250).writeAsync(file.path)

        const avatarFileName = `${uuidv4()}-${file.originalname}`;
        const newPath = path.join(__dirname, `../public/avatars/${avatarFileName}`);
        await fs.rename(file.path, newPath);
        const avatarURL = `/avatars/${avatarFileName}`;
        res.status(200).json({ avatarURL });

    } catch (error) {
      console.error(error);
      next(error);  
    }
  } 

const verifyUSer = async (req, res, _) => {
    try {
        const { verificationToken } = req.params;
        const user = await service.getUserByVerificationToken(verificationToken);
        if (!user) {
            return res.status(404).json({ message: 'User not found'})
        } else {            
            service.verifyToken(verificationToken);
            return res.status(200).json({ message: 'Verification successful' });
        }
    } catch (error) {
        console.log(error)
    }
}

const resendVerificationEmail = async (req, res, _) => {
    try {
        const { email } = req.body;
        if (!email) {
           return res.status(400).json({ "message": "missing required field email" })
        }
        const user = await service.getUserByEmail(email);
        if (!user) {
           return res.status(400).json({ "message": "USer not found" })
        }
        if (user.verify) {
            return res.status(400).json({ "message": "Verification has already been passed" })
        }
        await emailService.sendVerificationEmail(user.email, user.verificationToken)
        return res.status(200).json({ "message": "Verification email sent" })
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    register,
    login,
    logout,
    current,
    updateAvatar,
    verifyUSer,
    resendVerificationEmail
}