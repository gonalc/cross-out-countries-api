import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize'
import sequelize from '../../db'
import UserModel from '../users/userModel'

const tableName = 'league'

class LeagueModel extends Model<
  InferAttributes<LeagueModel>,
  InferCreationAttributes<LeagueModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare defaultTax: number
  // declare logoId: number // provisional, need to make the images service
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // Associations
  declare user?: NonAttribute<UserModel>
  declare static associations: {
    user?: Association<LeagueModel, UserModel>
  }
}

LeagueModel.init(
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
    defaultTax: {
      type: DataTypes.FLOAT.UNSIGNED,
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

export default LeagueModel
