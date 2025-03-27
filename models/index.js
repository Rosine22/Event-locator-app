const Sequelize = require('sequelize');
const sequelize = new Sequelize('locator', 'postgres', 'Uwineza@22', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
});

const models = {
  User: require('./user')(sequelize),
  Event: require('./event')(sequelize),
  Category: require('./category')(sequelize),
  UserPreference: require('./user_preference')(sequelize),
  EventCategory: require('./event_category')(sequelize),
  Notification: require('./notification')(sequelize),
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = { sequelize, ...models };