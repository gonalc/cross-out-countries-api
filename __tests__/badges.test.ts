import request from 'supertest'
import app from '../src/app'
import { StatusCodes } from 'http-status-codes'
import type { ModelStatic } from 'sequelize'
import db from '../src/db'
import type {
  BadgeAttributes,
  BadgeCreationAttributes,
} from '../src/api/badges/badgeTypes'
import BadgeModel from '../src/api/badges/badgeModel'

const NAME = 'Badge'
const BASE_URL = '/api/badges'

const newItem: BadgeCreationAttributes = {
  name: 'Test Badge',
  iconKey: 'test-icon',
  iconFamily: 'TestIcons',
  group: 'test',
}

const UPDATED_FIELD: keyof BadgeAttributes = 'name'
const UPDATED_VALUE = 'Test Edited Name BAdge'

describe('Badges API endpoints', () => {
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

    body.data.forEach((item: ModelStatic<BadgeModel>) => {
      expect(item).toHaveProperty('id')
    })
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
