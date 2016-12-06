/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('navigo', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    expiration: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'navigo'
  });
};
