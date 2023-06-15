import request from 'supertest'
import app from '../src/app'
import type { ModelStatic } from 'sequelize'
import db from '../src/db'
import LeagueModel from '../src/api/leagues/leagueModel'
import { StatusCodes } from 'http-status-codes'
import type { InvitationCreationAttributes } from '../src/api/invitations/invitationTypes'
import type { UserCreationAttributes } from '../src/api/users/userTypes'
import type { LeagueCreationAttributes } from '../src/api/leagues/leagueTypes'

const NAME = 'Invitation'
const BASE_URL = '/api/invitations'

// Dependencies
const USERS_URL = '/api/users'
const LEAGUES_URL = '/api/leagues'

let newItem: InvitationCreationAttributes

const userItem: UserCreationAttributes = {
  email: `test_leagues_user+${new Date().getTime()}@email.com`,
  username: `username_${new Date().getTime()}__invitations`,
  password: 'Prueba23',
  name: 'Test user',
  birthdate: new Date('1993/03/21'),
  country: 'spain',
  city: 'Madrid',
  score: 0,
}

const leagueItem: LeagueCreationAttributes = {
  name: 'TEST__League_invitations',
}

describe('Invitations API endpoints', () => {
  let createdId: number
  let createdUserId: number
  let createdLeagueId: number

  beforeAll(async () => {
    await db.sync()
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

    // League
    const newLeague = {
      ...leagueItem,
      user: { id: createdUserId },
    }

    const leagueRes = await request(app).post(LEAGUES_URL).send(newLeague)

    expect(leagueRes.statusCode).toBe(StatusCodes.CREATED)
    expect(leagueRes.body.data).toHaveProperty('id')

    createdLeagueId = leagueRes.body.data.id

    newItem = {
      userId: createdUserId,
      leagueId: createdLeagueId,
      leagueName: 'TEST__INVITATION_LEAGUE',
    }
  })

  it(`Should create a ${NAME} and return the created one.`, async () => {
    const res = await request(app)
      .post(BASE_URL)
      .send({
        ...newItem,
      })

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

  it(`Should accept the right ${NAME} for the given ID.`, async () => {
    const url = `${BASE_URL}/accept/${createdId}`

    const res = await request(app).post(url).send(newItem)

    const { statusCode } = res

    expect(statusCode).toBe(StatusCodes.OK)
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
