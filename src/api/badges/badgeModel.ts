import {
  DataTypes,
  Model,
  Association,
  type NonAttribute,
  type CreationOptional,
} from 'sequelize'
import sequelize from '../../db'
import type { BadgeAttributes, BadgeCreationAttributes } from './badgeTypes'
import UserModel from '../users/userModel'

const tableName = 'badge'

class BadgeModel extends Model<BadgeAttributes, BadgeCreationAttributes> {
  declare id: CreationOptional<number>
  declare name: string
  declare iconKey: string
  declare iconFamily: string
  declare color: string
  declare group: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // Associations
  declare players?: NonAttribute<UserModel[]>
  declare static associations: {
    players?: Association<BadgeModel, UserModel>
  }
}

BadgeModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    iconKey: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    iconFamily: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: 'bronze',
    },
    group: {
      type: DataTypes.STRING(32),
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

export default BadgeModel
