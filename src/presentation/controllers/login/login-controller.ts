import { badRequest, unauthorized, serverError, ok } from '../../helpers/http/http-helper'
import {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './login-controller-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body

      const acessToken = await this.authentication.auth({ email, password })
      if (!acessToken) return unauthorized()
      return ok({ acessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}