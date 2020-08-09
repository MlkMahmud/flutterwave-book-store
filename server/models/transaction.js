const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {}
  }
  Transaction.init(
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
      modelName: 'Transaction',
    },
  );
  return Transaction;
};
