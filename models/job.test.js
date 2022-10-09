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

/************************************** get jobs */

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
        salary: 200,
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

describe('Test filterJobs method', () => {
  test('filter by title', async () => {
    let jobs = await Job.getAllJobs();
    jobs = await Job.filterJobs({ title: 'J3' }, jobs);
    expect(jobs).toEqual([
      {
        id: 3,
        title: 'J3',
        salary: 100,
        equity: '0.0',
        companyHandle: 'c1',
      },
    ]);
  });

  test('filter by salary', async () => {
    let jobs = await Job.getAllJobs();
    jobs = await Job.filterJobs({ minSalary: 150 }, jobs);
    expect(jobs).toEqual([
      {
        id: 2,
        title: 'J2',
        salary: 200,
        equity: '0.085',
        companyHandle: 'c2',
      },
    ]);
  });
  test('filter by equity', async () => {
    let jobs = await Job.getAllJobs();
    jobs = await Job.filterJobs({ hasEquity: true }, jobs);
    expect(jobs).toEqual([
      {
        id: 2,
        title: 'J2',
        salary: 200,
        equity: '0.085',
        companyHandle: 'c2',
      },
    ]);
  });
});

/***********************get by id */

describe('Get job by id', () => {
  test('works with valid id', async () => {
    const job = await Job.getJob(2);
    expect(job).toEqual({
      id: 2,
      title: 'J2',
      salary: 200,
      equity: '0.085',
      companyHandle: 'c2',
    });
  });

  test('not found if no job with given id', async function () {
    try {
      await Job.getJob(1000);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************* Update job method */

describe('Update job by id', () => {
  test('works with valid id', async () => {
    const updateData = { salary: 300 };
    const job = await Job.updateJob(2, updateData);
    expect(job).toEqual({
      id: 2,
      title: 'J2',
      salary: 300,
      equity: '0.085',
      companyHandle: 'c2',
    });
  });

  test('not found if no job with given id', async function () {
    try {
      await Job.getJob(1000);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
