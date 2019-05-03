"use strict";

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const accountHandler = require('../handlers/AccountHandler').instance;
const db = require('../handlers/DatabaseHandler').instance;

/* Do login. */
router.post('/login', (req, res, next) => {
  const authData = req.body;
  accountHandler.login(authData.uname, authData.psw).then((result) => {
    if (!result[0]) {
      next(result[1]);
      return;
    }
    result[1].name = authData.uname;
    let token = jwt.sign(result[1], process.env.PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: '3 days'
    });

    const ret = {
      jwt: "Bearer " + token,
      id: result[1].id,
      flag: result[1].flag,
      totals: result[1].totals,
    }
    res.json(ret);
  });
});

module.exports = router;