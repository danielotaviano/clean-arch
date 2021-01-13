import {
  Authentication,
  LoadAccountByEmailRepository,
  HashCompare,
  TokenGenerator,
  UpdateAccessTokenRepository,
  AuthRequest
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth({ email, password }: AuthRequest): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) return null

    const isValidPassword = await this.hashCompare.compare(password, account.password)
    if (!isValidPassword) return null

    const accessToken = await this.tokenGenerator.generate(account.id)
    await this.updateAccessTokenRepository.update(account.id, accessToken)
    return accessToken
  }
}
