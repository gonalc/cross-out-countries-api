import request from 'supertest'
import app from '../src/app'
import { StatusCodes } from 'http-status-codes'
import db from '../src/db'

import { generateSalt, hashPassword } from '../src/utils/crypto'
import type { UserCreationAttributes } from '../src/api/users/userTypes'

const NAME = 'Auth'
const BASE_URL = '/api/auth'

const TEST_PASSWORD = 'Prueba23'
const WRONG_PASSWORD = 'wrongPassword'
const WRONG_SALT = 'hiThisIsTheWrongSalt'
let salt: string
const WRONG_EMAIL = 'thisemaildoesntexist@database.com'

// Dependencies
const USERS_URL = '/api/users'

const userItem: UserCreationAttributes = {
  email: `test_auth+${new Date().getTime()}@email.com`,
  username: `username_${new Date().getTime()}__auth`,
  password: TEST_PASSWORD,
  name: 'Test user',
  birthdate: new Date('1993/03/21'),
  country: 'spain',
  city: 'Madrid',
  score: 0,
}

describe('Auth API tests', () => {
  let createdUserId: number
  let referredUserId: number

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
    // User
    const newUser = {
      ...userItem,
    }

    const userRes = await request(app).post(USERS_URL).send(newUser)

    expect(userRes.statusCode).toBe(StatusCodes.CREATED)
    expect(userRes.body.data).toHaveProperty('id')

    createdUserId = userRes.body.data.id
  })

  it('Should login successfully with email and get the jwt token', async () => {
    const url = `${BASE_URL}/login`

    const loginData = {
      userKey: userItem.email,
      password: TEST_PASSWORD,
    }

    const res = await request(app).post(url).send(loginData)

    const { statusCode, body } = res

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('jwt')
    expect(body.data).toHaveProperty('user')
  })

  it('Should login successfully with username and get the jwt token', async () => {
    const url = `${BASE_URL}/login`

    const loginData = {
      userKey: userItem.username,
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
      userKey: WRONG_EMAIL,
      password: TEST_PASSWORD,
    }

    const res = await request(app).post(url).send(loginData)

    const { statusCode } = res

    expect(statusCode).toBe(StatusCodes.NOT_FOUND)
  })

  it('Should try to login with wrong password and get an unauthorized error', async () => {
    const url = `${BASE_URL}/login`

    const loginData = {
      userKey: userItem.email,
      password: WRONG_PASSWORD,
    }

    const res = await request(app).post(url).send(loginData)

    const { statusCode } = res

    expect(statusCode).toBe(StatusCodes.UNAUTHORIZED)
  })

  it('Should create a user with a referred link and increase the referral column', async () => {
    const url = `${BASE_URL}/signup?referral=${userItem.username}`
    const referrerUrl = `${USERS_URL}/${createdUserId}`

    const referredUser = {
      ...userItem,
      email: `referred_${userItem.email}`,
      username: `referred_${userItem.username}`,
      name: `referred_${userItem.name}`,
    }

    const res = await request(app).post(url).send(referredUser)
    const referrerRes = await request(app).get(referrerUrl)

    const { statusCode, body } = res
    const { statusCode: referrerStatusCode, body: referrerBody } = referrerRes

    referredUserId = body.data.user.id

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toBeDefined()
    expect(body.data).toHaveProperty('user')
    expect(body.data.user).toHaveProperty('id')

    expect(referrerStatusCode).toBe(StatusCodes.OK)
    expect(referrerBody.data).toBeDefined()
    expect(referrerBody.data).toHaveProperty('id')
    expect(referrerBody.data).toHaveProperty('referredUsers')
    expect(referrerBody.data.referredUsers).toBe(1)
  })

  it(`Should delete the ${NAME} dependencies.`, async () => {
    const userUrl = `${USERS_URL}/${createdUserId}`
    const referralUrl = `${USERS_URL}/${referredUserId}`

    const res = await request(app).delete(userUrl)
    const referralRes = await request(app).delete(referralUrl)

    const { statusCode, body } = res
    const { statusCode: referralStatusCode, body: referralBody } = referralRes

    expect(statusCode).toBe(StatusCodes.OK)
    expect(body.data).toHaveProperty('id')
    expect(body.data.id).toBe(createdUserId)

    expect(referralStatusCode).toBe(StatusCodes.OK)
    expect(referralBody.data).toHaveProperty('id')
    expect(referralBody.data.id).toBe(referredUserId)
  })

  afterAll(async () => {
    await db.close()
  })
})
