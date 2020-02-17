const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/auth');

router.post('/register', authControllers.register);
router.post('/validatelogin', authControllers.validateLogin);
router.post('/login', authControllers.login);
router.post('/resetpassword', authControllers.resetPassword);
router.post('/confirmpasswordreset', authControllers.confirmPasswordReset);


module.exports = router;