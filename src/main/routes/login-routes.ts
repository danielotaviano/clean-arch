import { Router } from 'express'
import { AdaptRoute } from '../adapters/express/express-route-adapter'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', AdaptRoute(makeSignUpController()))
  router.post('/login', AdaptRoute(makeLoginController()))
}
