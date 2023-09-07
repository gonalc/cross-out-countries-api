import crypto from 'crypto'

const SALT_SIZE = 128
const ENCODING: BufferEncoding = 'hex'
const ITERATIONS = 1000
const KEYLEN = 64
const DIGEST = 'sha512'

export function generateRandomString(size: number): string {
  const randomString = crypto.randomBytes(size).toString(ENCODING)

  return randomString
}

export function generateSalt(): string {
  const salt = generateRandomString(SALT_SIZE)

  return salt
}

export function hashPassword(rawPassword: string, salt: string): string {
  const hash = crypto
    .pbkdf2Sync(rawPassword, salt, ITERATIONS, KEYLEN, DIGEST)
    .toString(ENCODING)

  return hash
}
