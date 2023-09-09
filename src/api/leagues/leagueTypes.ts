import type { Optional } from 'sequelize'
import type { GenericItem, GenericOptionalField } from '../../types/models'

export type LeagueAttributes = GenericItem & {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export type LeagueCreationAttributes = Optional<
  LeagueAttributes,
  GenericOptionalField
>
