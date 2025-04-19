const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/AuthControllers');
const { validRegister } = require('../midllewares/ValidRegister');

const adminRouter = require('./admin');

router.post('/login/user', login);

router.post('/login/admin', login);

router.post('/register/user', validRegister, register);

router.post('/register/admin', validRegister, register);

router.use('/', adminRouter);

module.exports = router;