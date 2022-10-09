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
  test('works', async function () {
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

    //     const result = await db.query(
    //       `SELECT handle, name, description, num_employees, logo_url
    //            FROM companies
    //            WHERE handle = 'new'`
    //     );
    //     expect(result.rows).toEqual([
    //       {
    //         handle: 'new',
    //         name: 'New',
    //         description: 'New Description',
    //         num_employees: 1,
    //         logo_url: 'http://new.img',
    //       },
    //     ]);
    //   });

    //   test('bad request with dupe', async function () {
    //     try {
    //       await Company.create(newCompany);
    //       await Company.create(newCompany);
    //       fail();
    //     } catch (err) {
    //       expect(err instanceof BadRequestError).toBeTruthy();
    //     }
  });
});
