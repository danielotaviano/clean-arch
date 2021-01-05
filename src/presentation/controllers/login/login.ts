import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, unauthorized, serverError, ok } from '../../helpers/http-helper'
import {
  EmailValidator,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse
} from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const acessToken = await this.authentication.auth({ email, password })
      if (!acessToken) return unauthorized()
      return ok({ acessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
