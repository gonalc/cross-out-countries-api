import type { Optional } from 'sequelize'
import type { GenericItem, GenericOptionalField } from '../../types/models'

export type CountryAttributes = GenericItem & {
  code: string
  latitude: number
  longitude: number
  population: number
}

export type CountryCreationAttributes = Optional<
  CountryAttributes,
  GenericOptionalField
>
