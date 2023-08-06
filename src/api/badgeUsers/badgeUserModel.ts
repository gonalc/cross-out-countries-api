import { type CreationOptional, Model, DataTypes } from 'sequelize'
import sequelize from '../../db'
import type {
  BadgeUserAttributes,
  BadgeUserCreationAttributes,
} from './badgeUserTypes'
import BadgeModel from '../badges/badgeModel'
import UserModel from '../users/userModel'

const tableName = 'badge_user'

class BadgeUserModel extends Model<
  BadgeUserAttributes,
  BadgeUserCreationAttributes
> {
  declare id: CreationOptional<number>
  declare badgeId: number
  declare userId: number
}

BadgeUserModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    badgeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName,
    timestamps: false,
    underscored: true,
  }
)

BadgeModel.associations.players = BadgeModel.belongsToMany(UserModel, {
  through: BadgeUserModel,
  foreignKey: 'badge_id',
  as: 'players',
  onDelete: 'CASCADE',
})

UserModel.associations.badges = UserModel.belongsToMany(BadgeModel, {
  through: BadgeUserModel,
  foreignKey: 'user_id',
  as: 'badges',
  onDelete: 'CASCADE',
})

export default BadgeUserModel
