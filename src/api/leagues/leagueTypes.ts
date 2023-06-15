import type { Optional } from 'sequelize'

export type LeagueAttributes = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export type LeagueCreationAttributes = Optional<
  LeagueAttributes,
  'id' | 'createdAt' | 'updatedAt'
>
