import jwt from 'jsonwebtoken'

interface IJWTPayload {
  id: number
  email: string
  iat: number
  exp: number
}

const SECRET_KEY: string =
  process.env.SECRET_KEY || 'hcv8s9vhso8fghs9o8vhso#@$F#$FRq3fc'

export function signToken(payload: Record<string, unknown>): string | void {
  const ONE_YEAR_LONG = 365 * 24 * 60 * 60

  const options: jwt.SignOptions = {
    expiresIn: ONE_YEAR_LONG,
  }

  const token = jwt.sign(payload, SECRET_KEY, options)

  return token
}

export function verifyToken(token: string) {
  const tokenPayload = jwt.verify(token, SECRET_KEY)

  if (tokenPayload) {
    return tokenPayload as IJWTPayload
  }

  return null
}
