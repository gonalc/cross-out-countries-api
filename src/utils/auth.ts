import jwt from 'jsonwebtoken'

interface IJWTPayload {
  id: number
  email: string
  iat: number
  exp: number
}

export function signToken(payload: Record<string, unknown>): string | void {
  const ONE_YEAR_LONG = 365 * 24 * 60 * 60

  const options: jwt.SignOptions = {
    expiresIn: ONE_YEAR_LONG,
  }

  const token = jwt.sign(payload, process.env.SECRET_KEY, options)

  return token
}

export function verifyToken(token: string) {
  const tokenPayload = jwt.verify(token, process.env.SECRET_KEY)

  if (tokenPayload) {
    return tokenPayload as IJWTPayload
  }

  return null
}
