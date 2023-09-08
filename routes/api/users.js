const express = require('express');
const router = express.Router();
const ctrlUsers = require('../../controller/users');

router.post('/users/signup', ctrlUsers.register);



module.exports = router