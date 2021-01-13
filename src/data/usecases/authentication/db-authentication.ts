import { Authentication, AuthRequest } from '../../../domain/usecases/authentication'
import { HashCompare } from '../../protocols/criptography/hash-compare'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashCompare) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
  }

  async auth({ email, password }: AuthRequest): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      await this.hashCompare.compare(password, account.password)
    }

    return null
  }
}
