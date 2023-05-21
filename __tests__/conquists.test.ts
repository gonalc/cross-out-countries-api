import request from 'supertest'
import app from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { Attributes, CreationAttributes, ModelStatic } from 'sequelize'
import db from '../src/db'
import ConquistModel from '../src/api/conquists/conquistModel'
import UserModel from '../src/api/users/userModel'

const NAME = 'Conquists'
const BASE_URL = '/api/conquists'

const baseItem = {
  country: 'spain',
  province: 'Madrid',
  birthYear: 1994,
  place: 'Italy',
}

let newItem: CreationAttributes<ConquistModel>

// Dependencies
const USERS_URL = '/api/users'
const userItem: CreationAttributes<UserModel> = {
  email: `test_conquist+${new Date().getTime()}@email.com`,
  password: 'Prueba23',
  username: `username_${new Date().getTime()}__conquists`,
  name: 'Test user for conquist',
  birthdate: new Date('1993/03/21'),
  country: 'Spain',
  city: 'Madrid',
  score: 0,
}

const UPDATED_FIELD: keyof Attributes<ConquistModel> = 'country'
const UPDATED_VALUE = 'italy'

const PAGINATION_OFFSET = 0
const PAGINATION_LIMIT = 3

describe('Conquists API endpoints', () => {
  let createdId: number

  beforeAll(async () => {
    await db.sync()
  })

  it(`Should create the needed dependencies for the ${NAME}`, async () => {
    // League
    const usersRes = await request(app).post(USERS_URL).send(userItem)

    newItem = {
      ...baseItem,
      userId: usersRes.body.data.id,
    }

    expect(usersRes.statusCode).toBe(StatusCodes.CREATED)
    expect(usersRes.body.data).toHaveProperty('id')
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

  it(`Should get a single ${NAME}.`, async () => {
    const url = `${BASE_URL}/${createdId}`

    const res = await request(app).get(url)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('id')
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
