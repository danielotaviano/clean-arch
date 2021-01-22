import { Router } from 'express'
import { AdaptRoute } from '../adapters/express-route-adapter'
import { makeSignUpController } from '../factories/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', AdaptRoute(makeSignUpController()))
}
