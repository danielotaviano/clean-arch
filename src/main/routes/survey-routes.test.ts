/* eslint-disable jest/expect-expect */
import { Collection } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let surveyCollection: Collection

describe('Survey Routes', () => {
  const mongod = new MongoMemoryServer()

  beforeAll(async () => {
    const uri = await mongod.getUri()

    await MongoHelper.connect(uri)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 406 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answers: [{
              answer: 'Answer 1',
              image: 'http://image-name.com'
            }, {
              answer: 'Answer 2'
            }]
          }
          ]
        })
        .expect(403)
    })
  })
})
