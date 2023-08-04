import { DataTypes, Model } from 'sequelize'
import type { CreationOptional } from 'sequelize'
import sequelize from '../../db'
import type { BadgeAttributes, BadgeCreationAttributes } from './badgeTypes'

const tableName = 'badge'

class BadgeModel extends Model<BadgeAttributes, BadgeCreationAttributes> {
  declare id: CreationOptional<number>
  declare name: string
  declare iconKey: string
  declare iconFamily: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
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
