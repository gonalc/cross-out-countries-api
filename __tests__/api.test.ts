import request from 'supertest'
import app from '../src/app'
import db from '../src/db'
import { StatusCodes } from 'http-status-codes'

describe('Basic API tests', () => {
  beforeAll(async () => {
    await db.sync()
  })

  it('Should return API version and title of the app', async () => {
    const res = await request(app).get('/api')

    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.app).toBe(app.locals.title)
    expect(res.body.apiVersion).toBe(app.locals.version)
  })

  afterAll(async () => {
    await db.close()
  })
})
