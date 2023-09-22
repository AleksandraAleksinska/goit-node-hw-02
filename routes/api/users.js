const express = require('express');
const router = express.Router();
const ctrlUsers = require('../../controller/users');
const auth = require('../../middleware/authorization');
const upload = require('../../middleware/multer')

router.post('/users/signup', ctrlUsers.register);
router.post('/users/login', ctrlUsers.login);
router.get('/users/logout', auth,  ctrlUsers.logout);
router.get('/users/current', auth, ctrlUsers.current);
router.patch('/users/avatars', auth, upload.single('avatar'), ctrlUsers.updateAvatar);
router.get('/users/verify/:verificationToken', ctrlUsers.verifyUSer);
router.post('/users/verify/', ctrlUsers.resendVerificationEmail);

module.exports = router