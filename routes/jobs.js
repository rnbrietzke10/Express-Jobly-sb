'use strict';

/** Routes for jobs. */

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError } = require('../expressError');
const { ensureLoggedIn, isAdministrator } = require('../middleware/auth');
const Job = require('../models/job');

const jobNewSchema = require('../schemas/newJob.json');

const router = new express.Router();

/** POST / { job } =>  { job }
 *
 * job should be {title, salary, equity, companyHandle }
 *
 * Returns { title, salary, equity, companyHandle }
 *
 * Authorization required: login
 */

router.post('/', [ensureLoggedIn, isAdministrator], async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const job = await Job.create(req.body);
    return res.json({ job });
  } catch (e) {
    return next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.getAllJobs();
    return res.json(jobs);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
