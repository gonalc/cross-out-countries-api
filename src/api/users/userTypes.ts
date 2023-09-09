import type { Optional } from 'sequelize'
import type { GenericItem, GenericOptionalField } from '../../types/models'

export type UserAttributes = GenericItem & {
  name: string
  username: string
  birthdate: Date
  country: string
  city: string
  email: string
  password: string
  salt: string
  score: number
  fcmToken: string
  referredUsers: number
  referralCode: string

  // Virtual
  countries?: string[]
  places?: string[]
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  | GenericOptionalField
  | 'countries'
  | 'places'
  | 'salt'
  | 'fcmToken'
  | 'referredUsers'
  | 'referralCode'
>

export type UserResponse = Omit<UserAttributes, 'salt' | 'password'>
