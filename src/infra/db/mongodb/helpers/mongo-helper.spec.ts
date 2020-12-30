import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper as sut } from './mongo-helper'

describe('MongoHelper', () => {
  const mongod = new MongoMemoryServer()

  beforeAll(async () => {
    const uri = await mongod.getUri()
    await sut.connect(uri)
  })
  afterAll(async () => {
    await sut.disconnect()
    await mongod.stop()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')

    expect(accountCollection).toBeTruthy()

    await sut.disconnect()

    accountCollection = await sut.getCollection('accounts')

    expect(accountCollection).toBeTruthy()
  })
})
