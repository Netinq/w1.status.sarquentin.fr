const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connexion");
const Host = require("./Host");

class Status extends Model {}

Status.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    host_id: {
      type: DataTypes.BIGINT,
    },
    code: {
      type: DataTypes.SMALLINT
    },
    status: {
      type: DataTypes.TEXT
    },
    server: {
      type: DataTypes.TEXT
    },
    tech: {
      type: DataTypes.TEXT
    },
    delay: {
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize: sequelize,
    modelName: "status",
    tableName: "status",
    timestamps: false,
    
  }
);

Status.belongsTo(Host, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'host_id'
})

module.exports = Status;
