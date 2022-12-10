import express from 'express'
import { Includeable, Op, WhereOptions } from 'sequelize'

type TModifierRaw = keyof typeof Op

type TRawFilter = {
  [key: string]: string
}

function getModifier(raw: TModifierRaw) {
  const operator = Op[raw]

  return operator
}

export function getPopulatedFields(req: express.Request): Includeable {
  const { include } = req.query

  delete req.query.include

  return include as Includeable
}

export function getQueryFilters(req: express.Request): WhereOptions {
  const filters = req.query.filters as Record<string, TRawFilter>

  const where: WhereOptions = {}
  for (const filterKey in filters) {
    const filter: TRawFilter = filters[filterKey]

    if (typeof filter === 'object') {
      Object.entries(filter).forEach(([key, value]) => {
        const modifier = getModifier(key as TModifierRaw)

        where[filterKey] = { [modifier]: value }
      })
    } else {
      where[filterKey] = filter
    }
  }

  return where
}
