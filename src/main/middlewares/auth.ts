import { adaptMiddleware } from '../adapters/express-middleware-adapt'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export const auth = adaptMiddleware(makeAuthMiddleware())
