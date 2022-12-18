import Boom from '@hapi/boom'
import type {
  Attributes,
  CreateOptions,
  CreationAttributes,
  Includeable,
  Model,
  ModelStatic,
  UpdateOptions,
  WhereOptions,
} from 'sequelize'
import type { IPagination } from '../utils/pagination'

type TSchemaField<M extends Model> = keyof Attributes<M>

export interface IServiceOptions<M extends Model> {
  searchFields: TSchemaField<M>[] // Fields that will be used when searching by text.
}

export interface IFetchOptions {
  include?: Includeable[]
  where?: WhereOptions
}

export interface IFetchPagedOptions extends IFetchOptions, IPagination {}

class GenericService<M extends Model> {
  Model: ModelStatic<M>
  searchFields: TSchemaField<M>[]

  constructor(DBModel: ModelStatic<M>, { searchFields }: IServiceOptions<M>) {
    this.Model = DBModel
    this.searchFields = searchFields
  }

  async getAll(options: IFetchOptions) {
    try {
      const items = this.Model.findAll(options)

      return items
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }

  async getPaged(options: IFetchPagedOptions) {
    try {
      const result = await this.Model.findAndCountAll(options)

      return result
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }

  async getSingle(id: number, options: IFetchOptions) {
    try {
      const item = await this.Model.findByPk(id, options)

      return item
    } catch (error) {
      throw Boom.notFound(String(error))
    }
  }

  async exists(id: number) {
    try {
      const result = await this.Model.findByPk(id)

      return result
    } catch (error) {
      throw Boom.notFound(String(error))
    }
  }

  async create(
    data: CreationAttributes<M>,
    createOptions: CreateOptions<Attributes<M>> = {}
  ) {
    try {
      const created = await this.Model.create(data, createOptions)

      return created
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }

  async update(
    id: Attributes<M>['id'],
    data: UpdateOptions<Attributes<M>>,
    options: IFetchOptions
  ) {
    try {
      const where: WhereOptions<Attributes<M>> = { id }

      await this.Model.update(data, { where, individualHooks: true })

      const updated = this.getSingle(id, options)

      return updated
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }

  async destroy(id: Attributes<M>['id']) {
    try {
      await this.Model.destroy({
        where: { id },
      })

      return { id }
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }
}

export default GenericService
