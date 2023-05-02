import request from 'supertest'
import app from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { Attributes, CreationAttributes, ModelStatic } from 'sequelize'
import db from '../src/db'

import UserModel from '../src/api/users/userModel'
import LeagueModel from '../src/api/leagues/leagueModel'

const leagueItem: CreationAttributes<LeagueModel> = {
  name: 'TEST__League',
}

const NAME = 'User'
const BASE_URL = '/api/users'

// Dependencies:
const LEAGUES_URL = '/api/leagues'

const baseItem: CreationAttributes<UserModel> = {
  email: `test+${new Date().getTime()}@email.com`,
  password: 'Prueba23',
  name: 'Test user',
  birthdate: new Date('1993/03/21'),
  country: 'spain',
  city: 'Madrid',
}

const includedFields = 'leagues'

const UPDATED_FIELD = 'email'
const UPDATED_VALUE = `test+${new Date().getTime()}__edited__@email.com`

const PAGINATION_OFFSET = 0
const PAGINATION_LIMIT = 3

describe('Users API endpoints', () => {
  let createdId: number

  beforeAll(async () => {
    await db.sync()
  })

  it(`Should create a ${NAME} and return the created one.`, async () => {
    const res = await request(app).post(BASE_URL).send(baseItem)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.CREATED)
    expect(body.data).toBeDefined()
    expect(body.data).toHaveProperty('id')

    createdId = body.data.id
  })

  it(`Should create the needed dependencies for the ${NAME}`, async () => {
    // League
    const leaguesRes = await request(app)
      .post(LEAGUES_URL)
      .send({
        ...leagueItem,
        user: {
          id: createdId,
        },
      })

    expect(leaguesRes.statusCode).toBe(StatusCodes.CREATED)
    expect(leaguesRes.body.data).toHaveProperty('id')
  })

  it(`Should get all the ${NAME} in the DB.`, async () => {
    const res = await request(app).get(BASE_URL)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toBeDefined()

    body.data.forEach((item: ModelStatic<UserModel>) => {
      expect(item).toHaveProperty('id')
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

  it(`Should get all the ${NAME} with the related fields.`, async () => {
    const url = `${BASE_URL}?include=${includedFields}`

    const res = await request(app).get(url)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)

    body.data.forEach((result: Attributes<UserModel>) => {
      const included = includedFields.split(',')
      included.forEach((field) => {
        expect(result).toHaveProperty(field)
      })
    })
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
