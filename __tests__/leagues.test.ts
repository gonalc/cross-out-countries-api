import request from 'supertest'
import app from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { Attributes, CreationAttributes, ModelStatic } from 'sequelize'
import db from '../src/db'
import LeagueModel from '../src/api/leagues/leagueModel'

const NAME = 'League'
const BASE_URL = '/api/leagues'

const includedFields = 'players'

const newItem: CreationAttributes<LeagueModel> = {
  name: 'TEST__League',
}

const UPDATED_FIELD = 'name'
const UPDATED_VALUE = 'TEST__League__edited'

const PAGINATION_OFFSET = 0
const PAGINATION_LIMIT = 3

describe('Leagues API endpoints', () => {
  let createdId: number

  beforeAll(async () => {
    await db.sync()
  })

  it(`Should create a ${NAME} and return the created one.`, async () => {
    const res = await request(app).post(BASE_URL).send(newItem)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.CREATED)
    expect(body.data).toBeDefined()
    expect(body.data).toHaveProperty('id')

    createdId = body.data.id
  })

  it(`Should get all the ${NAME} in the DB.`, async () => {
    const res = await request(app).get(BASE_URL)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toBeDefined()

    body.data.forEach((item: ModelStatic<LeagueModel>) => {
      expect(item).toHaveProperty('id')
    })
  })

  it(`Should get all the ${NAME} with the related fields.`, async () => {
    const url = `${BASE_URL}?include=${includedFields}`

    const res = await request(app).get(url)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)

    body.data.forEach((result: Attributes<LeagueModel>) => {
      const included = includedFields.split(',')
      included.forEach((field) => {
        expect(result).toHaveProperty(field)
      })
    })
  })

  it(`Should get the ${NAME} result by page. It should also return the amount of the total matches in the DB.`, async () => {
    const url = `${BASE_URL}/paged?pagination[offset]=${PAGINATION_OFFSET}&pagination[limit]=${PAGINATION_LIMIT}`

    const res = await request(app).get(url)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('count')
    expect(body.data).toHaveProperty('rows')
    expect(body.data.rows.length).toBeLessThanOrEqual(PAGINATION_LIMIT)
  })

  it(`Should get a single ${NAME}.`, async () => {
    const url = `${BASE_URL}/${createdId}`

    const res = await request(app).get(url)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('id')
  })

  it(`Should get a single ${NAME} with the related fields.`, async () => {
    const url = `${BASE_URL}/${createdId}?include=${includedFields}`

    const res = await request(app).get(url)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('id')

    const included = includedFields.split(',')

    included.forEach((field) => {
      expect(body.data).toHaveProperty(field)
    })
  })

  it(`Should update the right ${NAME} depending on its ID and return the updated entry.`, async () => {
    const url = `${BASE_URL}/${createdId}`

    const updateData = { [UPDATED_FIELD]: UPDATED_VALUE }

    const res = await request(app).put(url).send(updateData)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('id')
    expect(body.data).toHaveProperty(UPDATED_FIELD)
    expect(body.data[UPDATED_FIELD]).toBe(UPDATED_VALUE)
  })

  it(`Should update the right ${NAME} depending on its ID and return the updated entry with the related fields.`, async () => {
    const url = `${BASE_URL}/${createdId}?include=${includedFields}`

    const updateData = { [UPDATED_FIELD]: UPDATED_VALUE }

    const res = await request(app).put(url).send(updateData)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('id')
    expect(body.data).toHaveProperty(UPDATED_FIELD)
    expect(body.data[UPDATED_FIELD]).toBe(UPDATED_VALUE)

    const included = includedFields.split(',')

    included.forEach((field) => {
      expect(body.data).toHaveProperty(field)
    })
  })

  it(`Should delete the right ${NAME} for the given ID.`, async () => {
    const url = `${BASE_URL}/${createdId}`

    const res = await request(app).delete(url)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('id')
    expect(body.data.id).toBe(createdId)
  })

  afterAll(async () => {
    await db.close()
  })
})
