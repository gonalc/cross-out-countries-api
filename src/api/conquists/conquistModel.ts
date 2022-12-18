import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize'
import sequelize from '../../db'
import UserModel from '../users/userModel'

const tableName = 'conquist'

class ConquistModel extends Model<
  InferAttributes<ConquistModel>,
  InferCreationAttributes<ConquistModel>
> {
  declare id: CreationOptional<number>
  declare country: string
  declare province: CreationOptional<string>
  declare birthYear: number
  declare place: string
  declare userId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

ConquistModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    country: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING(128),
    },
    birthYear: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    place: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName,
    timestamps: true,
    underscored: true,
  }
)

UserModel.associations.conquists = UserModel.hasMany(ConquistModel, {
  as: 'conquists',
  foreignKey: 'userId',
})
ConquistModel.belongsTo(UserModel, { foreignKey: 'userId' })

export default ConquistModel
