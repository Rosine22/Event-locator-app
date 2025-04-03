const { Notification, User, Event } = require('../models'); // Assuming models are indexed in models/index.js

// Send a notification
const sendNotification = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;

        // Check if user and event exist
        const user = await User.findByPk(user_id);
        const event = await Event.findByPk(event_id);
        if (!user || !event) {
            return res.status(404).json({ message: "User or Event not found" });
        }

        const notification = await Notification.create({ user_id, event_id });
        res.status(201).json({ message: "Notification sent", notification });
    } catch (error) {
        res.status(500).json({ message: "Error sending notification", error: error.message });
    }
};

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
    try {
        const { user_id } = req.params;
        const notifications = await Notification.findAll({
            where: { user_id },
            include: [{ model: Event, attributes: ['id', 'title', 'location', 'date'] }]
        });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByPk(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        await notification.destroy();
        res.json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification", error: error.message });
    }
};

module.exports = { sendNotification, getUserNotifications, deleteNotification };
