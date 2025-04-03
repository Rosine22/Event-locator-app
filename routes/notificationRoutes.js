const express = require('express');
const { sendNotification, getUserNotifications, deleteNotification } = require('../controllers/notificationController');

const router = express.Router();

router.post('/', sendNotification);        
router.get('/:user_id', getUserNotifications); 
router.delete('/:id', deleteNotification); 

module.exports = router;
