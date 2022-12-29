const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connexion");

class Host extends Model {}

Host.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING,
      unique: true
    }
  },
  {
    sequelize: sequelize,
    modelName: "hosts",
    timestamps: false,
  }
);

module.exports = Host;
