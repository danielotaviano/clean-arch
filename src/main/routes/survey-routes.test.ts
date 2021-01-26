/* eslint-disable jest/expect-expect */
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

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
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
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
    test('Should return 204 on add survey with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'Daniel Otaviano',
        email: 'danielotavianobp@gmail.com',
        password: '123'
      })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)

      await accountCollection.updateOne({
        _id: id
      }, {
        $set: {
          accessToken
        }
      })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
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
        .expect(204)
    })
  })
  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .send()
        .expect(403)
    })
    test('Should return 200 on load surveys with valid accessToken', async () => {
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [{
            image: 'any_image',
            answer: 'any_answer'
          }, {
            answer: 'any_answer'
          }],
          date: new Date()
        },
        {
          question: 'other_question',
          answers: [{
            image: 'other_image',
            answer: 'other_answer'
          }, {
            answer: 'other_answer'
          }],
          date: new Date()
        }
      ])
      const res = await accountCollection.insertOne({
        name: 'Daniel Otaviano',
        email: 'danielotavianobp@gmail.com',
        password: '123'
      })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)

      await accountCollection.updateOne({
        _id: id
      }, {
        $set: {
          accessToken
        }
      })
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
