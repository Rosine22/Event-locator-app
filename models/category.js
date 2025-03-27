const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  Category.associate = (models) => {
    Category.belongsToMany(models.User, { through: 'UserPreference', foreignKey: 'category_id' });
    Category.belongsToMany(models.Event, { through: 'EventCategory', foreignKey: 'category_id' });
  };

  return Category;
};