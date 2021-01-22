import { Router } from 'express'
import { AdaptRoute } from '../adapters/express/express-route-adapter'
import { makeLoginController } from '../factories/login/login-factory'
import { makeSignUpController } from '../factories/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', AdaptRoute(makeSignUpController()))
  router.post('/login', AdaptRoute(makeLoginController()))
}
