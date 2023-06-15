import type { Optional } from 'sequelize'

export type LeagueUserAttributes = {
  id: number
  leagueId: number
  userId: number
}

export type LeagueUserCreationAttributes = Optional<LeagueUserAttributes, 'id'>
