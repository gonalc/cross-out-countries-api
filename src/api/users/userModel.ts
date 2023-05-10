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
import { generateSalt, hashPassword } from '../../utils/crypto'
import ConquistModel from '../conquists/conquistModel'
import LeagueModel from '../leagues/leagueModel'

const tableName = 'user'

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare birthdate: Date
  declare country: string
  declare city: CreationOptional<string>
  declare email: string
  declare password: string
  declare salt: CreationOptional<string>
  declare score: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // Associations
  declare leagues?: NonAttribute<LeagueModel[]>
  declare conquists?: NonAttribute<ConquistModel[]>

  declare static associations: {
    leagues?: Association<UserModel, LeagueModel>
    conquists?: Association<UserModel, ConquistModel>
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(128),
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
    },
    score: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
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
    hooks: {
      beforeCreate: (user) => {
        const salt = generateSalt()
        const rawPassword = user.get('password')

        const hashedPassword = hashPassword(rawPassword, salt)

        user.salt = salt
        user.password = hashedPassword
      },
      beforeUpdate: (user) => {
        const salt = user.get('salt')
        const newPassword = user.getDataValue('password')

        const passwordHash = hashPassword(newPassword, salt)

        if (passwordHash !== user.previous('password')) {
          user.password = passwordHash
        }
      },
    },
  }
)

export default UserModel
