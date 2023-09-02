import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { getPaginationData, IPagination } from '../utils/pagination'
import { getPopulatedFields, getQueryFilters } from '../utils/query'
import GenericService, {
  type IFetchOptions,
  type IFetchPagedOptions,
} from './GenericService'
import type { FindOptions } from 'sequelize'
import { Request } from '../types/endpoints'

class GenericController<IService extends InstanceType<typeof GenericService>> {
  service: IService

  constructor(service: IService) {
    this.service = service
  }

  fetchAll = async (
    req: Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const include = getPopulatedFields(req)

      const filters = getQueryFilters(req)

      const options: FindOptions = {
        include,
        where: filters,
      }

      if (this.service.fieldsToOmit?.length) {
        options.attributes = {
          exclude: this.service.fieldsToOmit as string[],
        }
      }

      const data = await this.service.getAll(options)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }

  fetchPaged = async (
    req: Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const include = getPopulatedFields(req)

      const pagination: IPagination = getPaginationData(req)

      const filters = getQueryFilters(req)

      const options: IFetchPagedOptions = {
        include,
        ...pagination,
        where: filters,
      }

      if (this.service.fieldsToOmit?.length) {
        options.attributes = {
          exclude: this.service.fieldsToOmit as string[],
        }
      }

      const data = await this.service.getPaged(options)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }

  fetchSingle = async (
    req: Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const include = getPopulatedFields(req)

      const options: IFetchOptions = {
        include,
      }

      if (this.service.fieldsToOmit?.length) {
        options.attributes = {
          exclude: this.service.fieldsToOmit as string[],
        }
      }

      const id = parseInt(req.params.id)

      const data = await this.service.getSingle(id, options)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }

  create = async (
    req: Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = await this.service.create(req.body)

      return res.status(StatusCodes.CREATED).json({ data })
    } catch (error) {
      return next(error)
    }
  }

  createMany = async (
    req: Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = await this.service.createMany(req.body)

      return res.status(StatusCodes.CREATED).json({ data })
    } catch (error) {
      return next(error)
    }
  }

  update = async (
    req: Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const include = getPopulatedFields(req)

      const options: IFetchOptions = {
        include,
      }

      if (this.service.fieldsToOmit?.length) {
        options.attributes = {
          exclude: this.service.fieldsToOmit as string[],
        }
      }

      const id = parseInt(req.params.id)

      const data = await this.service.update(id, req.body, options)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }

  destroy = async (
    req: Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = parseInt(req.params.id)

      const data = await this.service.destroy(id)

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }
}

export default GenericController
