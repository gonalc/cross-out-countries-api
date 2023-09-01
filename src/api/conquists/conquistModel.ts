import { DataTypes, Model } from 'sequelize'
import type { CreationOptional } from 'sequelize'
import sequelize from '../../db'
import UserModel from '../users/userModel'
import type {
  ConquistAttributes,
  ConquistCreationAttributes,
} from './conquistTypes'

const tableName = 'conquist'

class ConquistModel extends Model<
  ConquistAttributes,
  ConquistCreationAttributes
> {
  declare id: CreationOptional<number>
  declare country: string
  declare province: CreationOptional<string>
  declare birthYear?: number | null
  declare place: string
  declare userId: number
  declare score: number
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
      allowNull: true,
    },
    place: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
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
