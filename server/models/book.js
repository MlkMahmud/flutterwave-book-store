const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {}
  }
  Book.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      image: DataTypes.STRING,
      price: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: 'Book',
    },
  );
  return Book;
};
