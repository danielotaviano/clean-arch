import {
  Authentication,
  LoadAccountByEmailRepository,
  HashCompare,
  Encrypter,
  UpdateAccessTokenRepository,
  AuthRequest
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth({ email, password }: AuthRequest): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) return null

    const isValidPassword = await this.hashCompare.compare(password, account.password)
    if (!isValidPassword) return null

    const accessToken = await this.encrypter.encrypt(account.id)
    await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
    return accessToken
  }
}
