const express = require('express');
const router = express.Router();

const {login, register} = require('../controllers/AuthControllers');

const adminRouter = require('./admin');

router.post('/login/user', login);

router.post('/login/admin', login);

router.post('/register/user', register);

router.post('/register/admin', register);



router.use('/', adminRouter);

module.exports = router;