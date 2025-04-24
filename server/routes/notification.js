const express = require('express');
const router = express.Router();
const auth = require('../midllewares/AuthMidlleware');

const NotificationController = require('../controllers/NotificationController')

router.get('/', auth, NotificationController.notification);
router.put('/:id/read', auth, NotificationController.markAsRead);


module.exports = router;