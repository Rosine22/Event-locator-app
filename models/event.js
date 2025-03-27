const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' },
    },
  });

  Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: 'created_by' });
    Event.belongsToMany(models.Category, { through: 'EventCategory', foreignKey: 'event_id' });
    Event.hasMany(models.Notification, { foreignKey: 'event_id' });
  };

  return Event;
};