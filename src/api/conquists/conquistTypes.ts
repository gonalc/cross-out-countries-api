import type { Optional } from 'sequelize'

export type ConquistAttributes = {
  id: number
  country: string
  province: string
  birthYear: number
  place: string
  userId: number
  score: number
  createdAt: Date
  updatedAt: Date
}

export type ConquistCreationAttributes = Optional<
  ConquistAttributes,
  'id' | 'createdAt' | 'updatedAt'
>
