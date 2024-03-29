import { DataTypes, Model } from 'sequelize'
import type { CreationOptional } from 'sequelize'
import sequelize from '../../db'
import LeagueModel from '../leagues/leagueModel'
import UserModel from '../users/userModel'
import {
  LeagueUserAttributes,
  LeagueUserCreationAttributes,
} from './leagueUserTypes'

const tableName = 'league_user'

class LeagueUserModel extends Model<
  LeagueUserAttributes,
  LeagueUserCreationAttributes
> {
  declare id: CreationOptional<number>
  declare leagueId: number
  declare userId: number
}

LeagueUserModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    leagueId: {
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

LeagueModel.associations.players = LeagueModel.belongsToMany(UserModel, {
  through: LeagueUserModel,
  foreignKey: 'league_id',
  as: 'players',
  onDelete: 'CASCADE',
})

UserModel.associations.leagues = UserModel.belongsToMany(LeagueModel, {
  through: LeagueUserModel,
  foreignKey: 'user_id',
  as: 'leagues',
  onDelete: 'CASCADE',
})

export default LeagueUserModel
