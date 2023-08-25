import type { Optional } from 'sequelize'

export type BadgeUserAttributes = {
  id: number
  badgeId: number
  userId: number
}

export type BadgeUserCreationAttributes = Optional<BadgeUserAttributes, 'id'>
