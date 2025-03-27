const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserPreference = sequelize.define('UserPreference', {
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' },
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Categories', key: 'id' },
      primaryKey: true,
    },
  });

  return UserPreference;
};