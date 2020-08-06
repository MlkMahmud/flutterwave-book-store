const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsToMany(models.User, { through: 'Purchase' });
    }
  }
  Book.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      image: DataTypes.STRING,
      price: DataTypes.NUMBER,
      summary: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Book',
    },
  );
  return Book;
};
