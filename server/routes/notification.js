const express = require('express');
const router = express.Router();
const auth = require('../midllewares/AuthMidlleware');

const NotificationController = require('../controllers/NotificationController')

router.get('/user', auth, NotificationController.notificationUser);
router.put('/admin/read', auth, NotificationController.adminNotificationRead);
router.get('/admin', auth, NotificationController.notificationAdmin);
router.put('/:id/read', auth, NotificationController.markAsRead);

module.exports = router;