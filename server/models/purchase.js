const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    static associate(models) {}
  }
  Purchase.init(
    {
      BookId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      transactionId: DataTypes.INTEGER,
      requested_refund: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      received_refund: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Purchase',
    },
  );
  return Purchase;
};
