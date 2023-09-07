import type { UserAttributes } from '../api/users/userTypes'
import { generateRandomString } from './crypto'

export type GenerateCodeInput = Pick<UserAttributes, 'username' | 'country'>

export function generateCode(data: GenerateCodeInput, length = 12) {
  const { username, country } = data

  const codeBase = `${username.slice(0, 3)}${country}`

  const random = generateRandomString(4)
  const randomLength = length - codeBase.length

  const code = `${random.slice(0, randomLength)}${codeBase}`

  return code.padStart(length, '0').toUpperCase()
}
