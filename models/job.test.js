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
