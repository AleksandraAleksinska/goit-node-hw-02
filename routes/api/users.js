const express = require('express');
const router = express.Router();
const ctrlUsers = require('../../controller/users');
const auth = require('../../middleware/authorization')

router.post('/users/signup', ctrlUsers.register);
router.post('/users/login', ctrlUsers.login);
router.get('/users/logout', auth,  ctrlUsers.logout);
router.get('/users/current', auth, ctrlUsers.current);

module.exports = router