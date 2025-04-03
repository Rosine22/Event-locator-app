const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const defineUser = require('../models/user');
const defineCategory = require('../models/category');
const defineEvent = require('../models/event');
const defineNotification = require('../models/notification');
const defineUserPreference = require('../models/UserPreference');

const sequelize = new Sequelize('sqlite::memory:', { logging: false });

const User = defineUser(sequelize);
const Category = defineCategory(sequelize);
const Event = defineEvent(sequelize);
const Notification = defineNotification(sequelize);
const UserPreference = defineUserPreference(sequelize);

// Set up associations
User.associate({ Category, Event, Notification });
Category.associate({ User, Event });
Event.associate({ User, Category, Notification });

// Sync database
beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create a test user
  const hashedPassword = await bcrypt.hash('testpassword', 10);
  await User.create({
    username: 'testuser',
    email: 'testuser@example.com',
    password_hash: hashedPassword,
  });
});

afterAll(async () => {
  await sequelize.close();
});

module.exports = { sequelize, User, Category, Event, Notification, UserPreference };
