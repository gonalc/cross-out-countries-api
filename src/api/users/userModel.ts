import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize'
import sequelize from '../../db'
import { generateSalt, hashPassword } from '../../utils/crypto'
import LeagueModel from '../leagues/leagueModel'

const tableName = 'user'

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>
  declare email: string
  declare password: string
  declare salt: CreationOptional<string>
  declare leagueId: ForeignKey<LeagueModel['id']>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // Associations
  declare league?: NonAttribute<LeagueModel>
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
    },
    leagueId: {
      type: DataTypes.INTEGER.UNSIGNED,
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

LeagueModel.hasOne(UserModel, {
  foreignKey: 'leagueId',
  as: 'user',
})

UserModel.belongsTo(LeagueModel, {
  onDelete: 'CASCADE',
  as: 'league',
})

export default UserModel
