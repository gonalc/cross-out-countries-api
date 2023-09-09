import type { Optional } from 'sequelize'
import type { GenericItem, GenericOptionalField } from '../../types/models'

export type ConquistAttributes = GenericItem & {
  country: string
  province: string
  birthYear?: number | null
  place: string
  userId: number
  score: number
}

export type ConquistCreationAttributes = Optional<
  ConquistAttributes,
  GenericOptionalField | 'birthYear'
>
