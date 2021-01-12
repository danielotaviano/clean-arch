import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/criptography/encrypter'

export class BcryptAdapter implements Encrypter {
  private readonly salt: number
  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (payload: string): Promise<string> {
    const hash = await bcrypt.hash(payload, this.salt)
    return hash
  }
}
