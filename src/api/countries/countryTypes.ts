import type { Optional } from 'sequelize'

export type CountryAttributes = {
  id: number
  code: string
  latitude: number
  longitude: number
  population: number
  createdAt: Date
  updatedAt: Date
}

export type CountryCreationAttributes = Optional<
  CountryAttributes,
  'id' | 'createdAt' | 'updatedAt'
>
