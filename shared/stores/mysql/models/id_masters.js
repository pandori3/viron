const Sequelize = require('sequelize');

const TABLE = 'idmasters';

module.exports = sequelize => {
  const model = sequelize.define(TABLE,
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: 'projectPathIndex',
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'projectPathIndex',
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      division: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    },
    {
      timestamps: true,
      paranoid: true,
      // underscored: true,
      // underscoredAll: true,
      // freezeTableName: false,
      // createdAt: true,
      // updatedAt: true,
      // deletedAt: true,
      charset: 'utf8',
      indexes: [
      ]
    }
  );
  return model;
};
