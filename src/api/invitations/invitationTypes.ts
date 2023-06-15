import type { Optional } from 'sequelize'

export type InvitationAttributes = {
  id: number
  userId: number
  leagueId: number
  leagueName: string
  createdAt: Date
}

export type InvitationCreationAttributes = Optional<
  InvitationAttributes,
  'id' | 'createdAt'
>
