import Boom from '@hapi/boom'
import { hashPassword } from '../../utils/crypto'
import { signToken, verifyToken } from '../../utils/auth'
import { omit } from 'lodash'
import UserService, { userFieldsToOmit } from '../users/userService'
import type { UserAttributes, UserCreationAttributes } from '../users/userTypes'

type TUserResponse = Omit<UserAttributes, 'salt' | 'password'>

export interface ILoginData {
  email: UserAttributes['email']
  password: string
  user: UserAttributes
}

interface ILoginResponse {
  user: TUserResponse
  jwt: string
}

interface IAuthService {
  login: (data: ILoginData) => Promise<ILoginResponse> | Promise<Error>
  _comparePasswords: (
    sourcePassword: string,
    targetPassword: string,
    salt: UserAttributes['salt']
  ) => boolean
  _getToken: (userData: UserAttributes) => string | void
}

const userService = new UserService()

class AuthService implements IAuthService {
  async login(loginData: ILoginData): Promise<ILoginResponse> {
    const { user } = loginData
    const { password, salt } = user

    const passwordValid = this._comparePasswords(
      loginData.password,
      password,
      salt
    )

    if (!passwordValid) {
      throw Boom.unauthorized('Credentials are not correct')
    }

    const jwt = this._getToken(user)

    if (!jwt) {
      throw Boom.badRequest('JWT could not be signed')
    }

    const responseData: ILoginResponse = {
      user: omit(user, userFieldsToOmit),
      jwt,
    }

    return responseData
  }

  async signup(userToCreate: UserCreationAttributes): Promise<ILoginResponse> {
    const createdUser = await userService.create(userToCreate)
    const user = createdUser.toJSON()

    const jwt = this._getToken(user)

    if (!jwt) {
      throw Boom.badRequest('JWT could not be signed')
    }

    const responseData: ILoginResponse = {
      user: omit(user, userFieldsToOmit),
      jwt,
    }

    return responseData
  }

  async check(token: string): Promise<ILoginResponse> {
    const tokenPayload = verifyToken(token)

    if (!tokenPayload) {
      throw Boom.badRequest('Invalid JWT')
    }

    const { id } = tokenPayload

    const userData = await userService.getSingle(id, {})

    if (!userData) {
      throw Boom.notFound('User not found')
    }

    const user = userData.toJSON()

    const jwt = this._getToken(user)

    if (!jwt) {
      throw Boom.badRequest('JWT could not be signed')
    }

    const responseData: ILoginResponse = {
      user: omit(user, userFieldsToOmit),
      jwt,
    }

    return responseData
  }

  _comparePasswords(
    sourcePassword: string,
    targetPassword: string,
    salt: UserAttributes['salt']
  ): boolean {
    const hashSource: string = hashPassword(sourcePassword, salt)

    return hashSource === targetPassword
  }

  _getToken(userData: UserAttributes) {
    const { email, id } = userData

    const payload = {
      email,
      id,
    }

    const token = signToken(payload)

    return token
  }
}

export default AuthService
