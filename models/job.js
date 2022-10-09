'use strict';

const db = require('../db');

const {
  BadRequestError,
  NotFoundError,
  ExpressError,
} = require('../expressError');

const { sqlForPartialUpdate } = require('../helpers/sql');

class Jobs {
  /** Create a job in db, update db, return new company data.
   *
   * data should be { title, salary, equity, company_handle }
   *
   * Returns { title, salary, equity, company_handle }
   *
   * */
  static async create({ title, salary, equity, companyHandle }) {
    const results = await db.query(
      `INSERT INTO jobs (title, salary, equity, company_handle)
      VALUES ($1, $2, $3, $4)
      RETURNING title, salary, equity, company_handle AS "companyHandle"
      `,
      [title, salary, equity, companyHandle]
    );

    const job = results.rows[0];

    return job;
  }
}

module.exports = Jobs;