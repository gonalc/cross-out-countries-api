import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize'
import sequelize from '../../db'

const tableName = 'country'

class CountryModel extends Model<
  InferAttributes<CountryModel>,
  InferCreationAttributes<CountryModel>
> {
  declare id: CreationOptional<number>
  declare code: string
  declare latitude: number
  declare longitude: number
  declare population: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

CountryModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    population: {
      type: DataTypes.INTEGER.UNSIGNED,
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

export default CountryModel
