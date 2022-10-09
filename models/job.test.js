'use strict';

const db = require('../db.js');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../expressError');
const Job = require('./job');
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('create', function () {
  test('create new job', async function () {
    const newJob = {
      title: 'test',
      salary: 120000,
      equity: 0.1,
      companyHandle: 'c1',
    };
    let job = await Job.create(newJob);
    expect(job).toEqual({
      title: 'test',
      salary: 120000,
      equity: '0.1',
      companyHandle: 'c1',
    });
  });
});

describe('Get all Jobs', () => {
  test('get all jobs function works', async () => {
    const jobs = await Job.getAllJobs();
    expect(jobs).toEqual([
      {
        id: 1,
        title: 'J1',
        salary: 100,
        equity: '0.0',
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
        equity: '0.0',
        companyHandle: 'c1',
      },
    ]);
  });
});
