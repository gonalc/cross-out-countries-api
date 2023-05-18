import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize'
import sequelize from '../../db'

const tableName = 'invitation'

class InvitationModel extends Model<
  InferAttributes<InvitationModel>,
  InferCreationAttributes<InvitationModel>
> {
  declare id: CreationOptional<number>
  declare userId: number
  declare leagueId: number
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

export default InvitationModel
