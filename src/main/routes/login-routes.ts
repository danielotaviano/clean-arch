import { Router } from 'express'
import { AdaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/login/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/login/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', AdaptRoute(makeSignUpController()))
  router.post('/login', AdaptRoute(makeLoginController()))
}
