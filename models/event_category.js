const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EventCategory = sequelize.define('EventCategory', {
    event_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Events', key: 'id' },
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Categories', key: 'id' },
      primaryKey: true,
    },
  });

  return EventCategory;
};