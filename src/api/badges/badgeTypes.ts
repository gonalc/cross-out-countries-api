import type { Optional } from 'sequelize'
import type { GenericItem, GenericOptionalField } from '../../types/models'

export type BadgeAttributes = GenericItem & {
  name: string
  iconKey: string
  iconFamily: string
  color: string
  group: string | null
}
export type BadgeCreationAttributes = Optional<
  BadgeAttributes,
  GenericOptionalField | 'color' | 'group'
>
