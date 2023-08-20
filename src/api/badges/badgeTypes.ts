import type { Optional } from 'sequelize'

export type BadgeAttributes = {
  id: number
  name: string
  iconKey: string
  iconFamily: string
  color: string
  createdAt: Date
  updatedAt: Date
}

export type BadgeCreationAttributes = Optional<
  BadgeAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'color'
>