const User = require('./schemas/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

const checkPassword = (password, hash) => bcrypt.compareSync(password, hash);

const getUserByEmail = async (email) => {
	return User.findOne({ email });
};

const registerUser = async ({ email, password }) => {
    const newUser = new User({ email, password })
    await newUser.save();
    return newUser
}

const loginUser = async ({ email, password }) => {
	try {
		const user = await User.findOne({ email });
		if (!user || !checkPassword(password, user.password)) {
			return null;
		} else {
			const payload = {
				email: user.email,
				_id: user._id,
			};
			const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" }
			);
			await User.findOneAndUpdate({ _id: user.id }, { $set: { token: token } });
			return await User.findOne({ email });
		}
	} catch (error) {
		console.error(error);
	}
};

const logoutUSer = async (id) => {
	try {
		return await User.findOneAndUpdate({ _id: id }, { $set: { token: null } });
	} catch (error) {
		console.error(error);
	}
};


module.exports = {
    hashPassword,
    getUserByEmail, 
    registerUser,
    loginUser,
    logoutUSer
}