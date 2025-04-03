const express = require('express');
const { sequelize, Sequelize } = require('./models/index.js'); // Import Sequelize explicitly
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const cron = require('node-cron');
const Queue = require('bull');
const { Event, User, UserPreference, Notification, EventCategory } = require('./models/index.js');
const categoryRoutes = require('./routes/category.routes'); // Import EventCategory explicitly
const notificationRoutes = require('./routes/notificationRoutes');
//const UserPreference = require('./models/UserPreference')
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;


const app = express();

// Initialize i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: { loadPath: './locales/{{lng}}/translation.json' },
  });

app.use(middleware.handle(i18next));
app.use(express.json());
app.use(require('./middlewares/i18n.js')); // Apply i18n globally

// Routes
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/events', require('./routes/eventRoutes.js')); 
app.use('/api/categories', require('./routes/category.routes.js'));
app.use('/notifications', require('./routes/notificationRoutes.js'));
// app.use('/preferences', require('./routes/userPreferences.js'));

// Notification Queue
const notificationQueue = new Queue('notifications', {
  redis: { port: 6379, host: '127.0.0.1' },
});

notificationQueue.process(async (job) => {
  const { userId, message } = job.data;
  console.log(`Sending notification to user ${userId}: ${message}`);
  // In a real app, integrate with email or push service
});

// Periodic Notification Task (runs every hour)
cron.schedule('0 * * * *', async () => {
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const events = await Event.findAll({
      where: {
        date: { [Sequelize.Op.between]: [now, next24Hours] },
      },
      include: [{ model: EventCategory }],
    });

    for (const event of events) {
      const users = await User.findAll({
        include: [
          {
            model: UserPreference,
            where: {
              category_id: { [Sequelize.Op.in]: event.EventCategories.map((ec) => ec.category_id) },
            },
          },
        ],
        where: Sequelize.where(
          Sequelize.fn(
            'ST_DWithin',
            Sequelize.col('location'),
            Sequelize.col('Event.location'),
            50000 // 50km radius
          ),
          true
        ),
      });

      for (const user of users) {
        const alreadyNotified = await Notification.findOne({
          where: { user_id: user.id, event_id: event.id },
        });
        if (!alreadyNotified) {
          await i18next.changeLanguage(user.language_preference);
          const message = i18next.t('notification_message', { eventTitle: event.title });
          await notificationQueue.add({ userId: user.id, message });
          await Notification.create({ user_id: user.id, event_id: event.id });
        }
      }
    }
  } catch (error) {
    console.error('Error in periodic task:', error);
  }
});

// Start Server
sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => console.log('Server running on port 3000'));
});

