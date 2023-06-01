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
import InvitationModel from '../invitations/invitationModel'
import { sortBy } from 'lodash'

const tableName = 'user'

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare username: string
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
  declare invitations?: NonAttribute<InvitationModel[]>

  // Virtual
  declare countries?: string[]
  declare places?: string[]

  declare static associations: {
    leagues?: Association<UserModel, LeagueModel>
    conquists?: Association<UserModel, ConquistModel>
    invitations?: Association<UserModel, InvitationModel>
  }

  getUniqueCountries(field: keyof ConquistModel) {
    if (!this.conquists) {
      return []
    }

    const sortedConquists = sortBy(this.conquists, ['createdAt']).reverse()
    const allCountries = sortedConquists.map((conquist) => conquist[field])
    const uniqueCountries = [...new Set(allCountries)]

    return uniqueCountries
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
      unique: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
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
    countries: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getUniqueCountries('country')
      },
    },
    places: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getUniqueCountries('place')
      },
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
