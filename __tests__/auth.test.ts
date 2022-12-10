import request from 'supertest'
import app from '../src/app'
import { StatusCodes } from 'http-status-codes'
import db from '../src/db'

import { generateSalt, hashPassword } from '../src/utils/crypto'
import { CreationAttributes } from 'sequelize'
import UserModel from '../src/api/users/userModel'
import LeagueModel from '../src/api/leagues/leagueModel'

const NAME = 'Auth'
const BASE_URL = '/api/auth'

const TEST_PASSWORD = 'Prueba23'
const WRONG_PASSWORD = 'wrongPassword'
const WRONG_SALT = 'hiThisIsTheWrongSalt'
let salt: string
const WRONG_EMAIL = 'thisemaildoesntexist@database.com'

// Dependencies
const USERS_URL = '/api/users'
const LEAGUES_URL = '/api/leagues'

const userItem: CreationAttributes<UserModel> = {
  email: `test_auth+${new Date().getTime()}@email.com`,
  password: TEST_PASSWORD,
}

const leagueItem: CreationAttributes<LeagueModel> = {
  name: 'TEST_auth__League',
  defaultTax: 14,
}

describe('Auth API tests', () => {
  let createdUserId: number
  let createdLeagueId: number

  beforeAll(async () => {
    await db.sync()
  })

  it('Should generate a random salt', () => {
    salt = generateSalt()

    expect(salt.length).toBeGreaterThanOrEqual(20)
  })

  it('Should hash the password', () => {
    const hashedPassword = hashPassword(TEST_PASSWORD, salt)
    const wrongSalt = hashPassword(TEST_PASSWORD, WRONG_SALT)
    const wrongPassword = hashPassword(WRONG_PASSWORD, salt)

    expect(hashedPassword).not.toBe(TEST_PASSWORD)
    expect(hashedPassword).not.toBe(wrongSalt)
    expect(hashedPassword).not.toBe(wrongPassword)
  })

  it(`Should create the dependencies for the ${NAME}.`, async () => {
    // League
    const leagueRes = await request(app).post(LEAGUES_URL).send(leagueItem)

    expect(leagueRes.statusCode).toBe(StatusCodes.CREATED)
    expect(leagueRes.body.data).toHaveProperty('id')

    createdLeagueId = leagueRes.body.data.id

    // User
    const newUser = {
      ...userItem,
      leagueId: createdLeagueId,
    }

    const userRes = await request(app).post(USERS_URL).send(newUser)

    expect(userRes.statusCode).toBe(StatusCodes.CREATED)
    expect(userRes.body.data).toHaveProperty('id')

    createdUserId = userRes.body.data.id
  })

  it('Should login successfully and get the jwt token', async () => {
    const url = `${BASE_URL}/login`

    const loginData = {
      email: userItem.email,
      password: TEST_PASSWORD,
    }

    const res = await request(app).post(url).send(loginData)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('jwt')
    expect(body.data).toHaveProperty('user')
  })

  it('Should try to login with wrong email and get a not found error', async () => {
    const url = `${BASE_URL}/login`

    const loginData = {
      email: WRONG_EMAIL,
      password: TEST_PASSWORD,
    }

    const res = await request(app).post(url).send(loginData)

    const { statusCode } = res

    expect(statusCode).toBe(StatusCodes.NOT_FOUND)
  })

  it('Should try to login with wrong password and get an unauthorized error', async () => {
    const url = `${BASE_URL}/login`

    const loginData = {
      email: userItem.email,
      password: WRONG_PASSWORD,
    }

    const res = await request(app).post(url).send(loginData)

    const { statusCode } = res

    expect(statusCode).toBe(StatusCodes.UNAUTHORIZED)
  })

  it(`Should delete the ${NAME} dependencies.`, async () => {
    const userUrl = `${USERS_URL}/${createdUserId}`

    const res = await request(app).delete(userUrl)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('id')
    expect(body.data.id).toBe(createdUserId)
  })

  afterAll(async () => {
    await db.close()
  })
})
