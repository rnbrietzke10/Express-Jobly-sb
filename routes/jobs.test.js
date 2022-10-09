'use strict';

const request = require('supertest');

const db = require('../db.js');
const app = require('../app');
const Job = require('../models/job');

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u4Token,
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe('POST /jobs', () => {
  const newJob = {
    title: 'Job1',
    salary: 78000,
    equity: 0.8,
    companyHandle: 'c1',
  };
  test('create job as authorized admin', async () => {
    const response = await request(app)
      .post('/jobs')
      .send(newJob)
      .set('authorization', `Bearer ${u4Token}`);
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      job: {
        title: 'Job1',
        salary: 78000,
        equity: '0.8',
        companyHandle: 'c1',
      },
    });
  });

  test('unable to create job unauth', async () => {
    const response = await request(app)
      .post('/jobs')
      .send(newJob)
      .set('authorization', `Bearer ${u2Token}`);
    expect(response.statusCode).toEqual(401);
  });

  test('bad request with missing data', async function () {
    const resp = await request(app)
      .post('/jobs')
      .send({
        title: 'new',
        salary: 10,
      })
      .set('authorization', `Bearer ${u4Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test('bad request with invalid data', async function () {
    const resp = await request(app)
      .post('/companies')
      .send({
        title: 'Job1',
        salary: 78000,
        equity: 200,
        companyHandle: 'c1',
      })
      .set('authorization', `Bearer ${u4Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});
