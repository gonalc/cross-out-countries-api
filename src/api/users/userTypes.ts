import type { Optional } from 'sequelize'

export type UserAttributes = {
  id: number
  name: string
  username: string
  birthdate: Date
  country: string
  city: string
  email: string
  password: string
  salt: string
  score: number
  createdAt: Date
  updatedAt: Date

  // Virtual
  countries?: string[]
  places?: string[]
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'countries' | 'places' | 'salt'
>
