const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOGRAPHY('POINT', 4326), // longitude, latitude in SRID 4326
    },
    language_preference: {
      type: DataTypes.STRING,
      defaultValue: 'en',
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Category, { through: 'UserPreference', foreignKey: 'user_id' });
    User.hasMany(models.Event, { foreignKey: 'created_by' });
    User.hasMany(models.Notification, { foreignKey: 'user_id' });
  };

  return User;
};