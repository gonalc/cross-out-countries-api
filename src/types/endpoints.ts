import express from 'express'
import type { TUserResponse } from '../api/auth/AuthService'

export interface Request extends express.Request {
  user?: TUserResponse
}
