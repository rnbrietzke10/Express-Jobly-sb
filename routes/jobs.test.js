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
const { resource } = require('../app');

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

describe('GET /jobs', () => {
  test('works for anon user', async () => {
    const response = await request(app).get('/jobs');
    expect(response.body).toEqual({
      jobs: [
        {
          id: 1,
          title: 'J1',
          salary: 100,
          equity: '0',
          companyHandle: 'c1',
        },
        {
          id: 2,
          title: 'J2',
          salary: 100,
          equity: '0.085',
          companyHandle: 'c2',
        },
        {
          id: 3,
          title: 'J3',
          salary: 100,
          equity: '0',
          companyHandle: 'c1',
        },
      ],
    });
  });
});

/************************************** GET /jobs/:id */

describe('GET /jobs/:id', () => {
  test('works for any user', async () => {
    const response = await request(app).get(`/jobs/1`);
    expect(response.body).toEqual({
      job: {
        id: 1,
        title: 'J1',
        salary: 100,
        equity: '0',
        companyHandle: 'c1',
      },
    });
  });

  test('job not found with given id', async () => {
    const response = await request(app).get(`/jobs/200`);
    expect(response.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:id */

describe('PATCH /jobs/:id', () => {
  test('works for admin authorized user', async () => {
    const response = await request(app)
      .patch(`/jobs/1`)
      .send({ title: 'UpdatdedJob' })
      .set('authorization', `Bearer ${u4Token}`);
    expect(response.body).toEqual({
      job: {
        id: 1,
        title: 'UpdatdedJob',
        salary: 100,
        equity: '0',
        companyHandle: 'c1',
      },
    });
  });

  test('unauthorized for regular users', async () => {
    const response = await request(app)
      .patch(`/jobs/1`)
      .send({ title: 'UpdatdedJob' })
      .set('authorization', `Bearer ${u1Token}`);
    expect(response.statusCode).toEqual(401);
  });

  test('unauthorized for anonymous user', async () => {
    const response = await request(app)
      .patch(`/jobs/1`)
      .send({ title: 'UpdatdedJob' });
    expect(response.statusCode).toEqual(401);
  });

  test('job not found', async () => {
    const response = await request(app)
      .patch('/jobs/200')
      .send({ title: 'WontUpdate' })
      .set('authorization', `Bearer ${u4Token}`);
    expect(response.statusCode).toEqual(404);
  });
});
