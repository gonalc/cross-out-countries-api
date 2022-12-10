import jwt from 'jsonwebtoken'

export function signToken(payload: Record<string, unknown>): string | void {
  const ONE_YEAR_LONG = 365 * 24 * 60 * 60

  const options: jwt.SignOptions = {
    expiresIn: ONE_YEAR_LONG,
  }

  const token = jwt.sign(payload, process.env.SECRET_KEY, options)

  return token
}
