'use strict';

/** Routes for jobs. */

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError } = require('../expressError');
const { ensureLoggedIn, isAdministrator } = require('../middleware/auth');
const Job = require('../models/job');

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
    const job = await Job.create(req.body);
    return res.json({ job });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
