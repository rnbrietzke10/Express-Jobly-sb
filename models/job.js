'use strict';

const db = require('../db');

const { NotFoundError } = require('../expressError');

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

    return results.rows[0];
  }

  /**
   * Gets all jobs
   *
   * RETURNS [{ id,title, salary, equity, companyHandle}]
   */

  static async getAllJobs() {
    const results = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
          FROM jobs`
    );

    return results.rows;
  }

  static async getJob(id) {
    const results = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
          FROM jobs WHERE id=$1`,
      [id]
    );
    if (!results.rows[0]) throw new NotFoundError(`No job with id: ${id}`);

    return results.rows[0];
  }

  /** UPDATE Job information with data given
   *
   * will only change the fields provided and will not change the id or company_handle
   *
   * Data can include: {title, salary, equity}
   *
   * RETURNS  {id, title, salary, equity, companyHandle}
   *
   * Throws error if not found
   */

  static async updateJob(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      companyHandle: 'company_handle',
    });
    const idIdx = `$${values.length + 1}`;

    const sqlQuery = `UPDATE jobs SET ${setCols}
                      WHERE id=${idIdx}
                      RETURNING id, title, salary, equity,
                      company_handle AS "companyHandle"
                      `;

    const results = await db.query(sqlQuery, [...values, id]);

    if (!results.rows[0]) throw new NotFoundError(`No job with id: ${id}`);
    console.log(results.rows[0]);

    return results.rows[0];
  }

  /** DELETES job with given id
   *
   * RETURNS  undefined
   *
   * Throws error if not found
   */

  static async deleteJob(id) {
    const results = await db.query(
      `DELETE FROM jobs WHERE id = $1 RETURNING id`,
      [id]
    );
    if (!results.rows[0]) {
      throw new NotFoundError(`No job found with id: ${id}`);
    }
  }

  static filterJobs(queryStrings, jobs) {
    /**Filters jobs based on query string properties of title, minSalary, and equaity. */
    let filteredJobs = jobs;
    let { title, minSalary, hasEquity } = queryStrings;
    // filters if title contains given string.
    if (title) {
      filteredJobs = filteredJobs.filter(job => {
        const jobTitle = job.title.toLowerCase();
        return jobTitle.includes(title.toLowerCase());
      });
    }

    // Filters for salaries greater than or equal to a given minSalary
    if (minSalary) {
      minSalary = parseInt(minSalary);
      filteredJobs = filteredJobs.filter(job => {
        return job.salary >= minSalary;
      });
    }
    // Filters companies that do not have equity
    if (hasEquity) {
      filteredJobs = filteredJobs.filter(job => {
        return parseFloat(job.equity) > 0;
      });
    }
    return filteredJobs;
  }
}

module.exports = Jobs;
