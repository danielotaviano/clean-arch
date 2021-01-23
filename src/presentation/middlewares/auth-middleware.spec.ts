/* eslint-disable jest/expect-expect */
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'

const makeFakeAccount = ():AccountModel => ({
  email: 'any_email@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'any_password_hash'
})

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (accessToken: string, role?: string): Promise<AccountModel> {
        return Promise.resolve(makeFakeAccount())
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)

    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should call LoadAccountByToken with correct accessToken', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (accessToken: string, role?: string): Promise<AccountModel> {
        const fakeAccount: AccountModel = {
          email: 'any_email@mail.com',
          id: 'any_id',
          name: 'any_name',
          password: 'any_password_hash'
        }
        return Promise.resolve(fakeAccount)
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
