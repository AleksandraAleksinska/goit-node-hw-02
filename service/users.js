const User = require('./schemas/user');

const getUserByEmail = async (email) => {
	return User.findOne({ email });
};

const registerUser = ({ email, password }) => {
    return User.create({ email, password })
}

// const registerUser = async ({ email, password }) => {
// 	try {
// 		// const hashedPassword = await hashPassword(password);
// 		const newUser = new User({ email, password });
// 		await newUser.save();
// 		return newUser;
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// const registerUser = async ({ email, password }) => {
//     try {
//         const newUser = new User({ email, password });
//         await newUser.save();
// 		console.log(newUser);

//         return newUser;
//     } catch (error) {
//         console.log(error);
//     }
// }


module.exports = {
    getUserByEmail, 
    registerUser,
}