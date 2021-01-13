import { Authentication, AuthRequest } from '../../../domain/usecases/authentication'
import { HashCompare } from '../../protocols/criptography/hash-compare'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly tokenGenerator: TokenGenerator
  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
  }

  async auth({ email, password }: AuthRequest): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) return null

    const isValidPassword = await this.hashCompare.compare(password, account.password)
    if (!isValidPassword) return null

    const accessToken = await this.tokenGenerator.generate(account.id)
    return accessToken
  }
}
