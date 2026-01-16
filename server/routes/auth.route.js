const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

//AUTH
const auth = require('../middleware/auth')

router.post('/register',  authController.register)
router.post('/login',  authController.loginApp)
router.get('/is-auth',  auth(),authController.isAuth)

module.exports = router;