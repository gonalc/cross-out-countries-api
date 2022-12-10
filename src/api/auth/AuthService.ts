import Boom from '@hapi/boom'
import { Attributes } from 'sequelize'
import { hashPassword } from '../../utils/crypto'
import UserModel from '../users/userModel'
import { signToken } from '../../utils/auth'
import { omit } from 'lodash'

type TUser = Attributes<UserModel>

type TUserResponse = Omit<TUser, 'salt' | 'password'>

export interface ILoginData {
  email: TUser['email']
  password: string
  user: TUser
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
    salt: TUser['salt']
  ) => boolean
  _getToken: (userData: TUser) => string | void
}

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
      user: omit(user, ['salt', 'password']),
      jwt,
    }

    return responseData
  }

  _comparePasswords(
    sourcePassword: string,
    targetPassword: string,
    salt: TUser['salt']
  ): boolean {
    const hashSource: string = hashPassword(sourcePassword, salt)

    return hashSource === targetPassword
  }

  _getToken(userData: TUser) {
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
