import { AddAccount, Hasher, AddAccountRepository, LoadAccountByEmailRepository, AddAccountModel, AccountModel } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise <AccountModel> {
    const isExistAccount = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (isExistAccount) return null

    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })
    return account
  }
};
