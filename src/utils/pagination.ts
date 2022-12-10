import express from 'express'
import { Attributes, Model, WhereOptions } from 'sequelize'

export interface IPagination {
  offset: number
  limit: number
  group?: unknown
}

export interface IPaginationData<M extends Model> {
  pagination: IPagination
  filters?: WhereOptions<Attributes<M>>
  text?: string
}

interface IPaginationQuery {
  pagination?: IPagination
}

const DEFAULT_PAGE_SIZE = 25

export function getPaginationData(
  req: express.Request<unknown, unknown, unknown, IPaginationQuery>
): IPagination {
  const { pagination } = req.query

  if (pagination) {
    const { offset, limit } = pagination

    const paginationData: IPagination = {
      offset: offset ? Number(offset) : 0,
      limit: limit ? Number(limit) : DEFAULT_PAGE_SIZE,
    }

    delete req.query.pagination

    return paginationData
  }

  return {
    offset: 0,
    limit: DEFAULT_PAGE_SIZE,
  }
}
