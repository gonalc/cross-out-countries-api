import { DataTypes, Model } from 'sequelize'
import type { CreationOptional } from 'sequelize'
import sequelize from '../../db'
import UserModel from '../users/userModel'
import {
  InvitationAttributes,
  InvitationCreationAttributes,
} from './invitationTypes'

const tableName = 'invitation'

class InvitationModel extends Model<
  InvitationAttributes,
  InvitationCreationAttributes
> {
  declare id: CreationOptional<number>
  declare userId: number
  declare leagueId: number
  declare leagueName: string
  declare createdAt: CreationOptional<Date>
}

InvitationModel.init(
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
    leagueName: {
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
  },
  {
    sequelize,
    tableName,
    timestamps: true,
    updatedAt: false,
    underscored: true,
  }
)

InvitationModel.belongsTo(UserModel, { foreignKey: 'userId' })

UserModel.associations.invitations = UserModel.hasMany(InvitationModel, {
  foreignKey: 'user_id',
  as: 'invitations',
  onDelete: 'CASCADE',
})

export default InvitationModel
