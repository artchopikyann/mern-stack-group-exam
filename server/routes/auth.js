const express = require('express');
const router = express.Router();

const {login, register} = require('../controllers/AuthControllers');

const adminRouter = require('./admin');

router.post('/login', login);

router.post('/register', register);

router.use('/', adminRouter);

module.exports = router;