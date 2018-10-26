"use strict";

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const AccountHandler = require('../handlers/AccountHandler');

/* Do login. */
router.post('/login', (req, res, next) => {
  const authData = req.body;
  AccountHandler.instance.login(authData.uname, authData.psw).then((result) => {
    if (!result[0]) {
      next(result[1]);
      return;
    }
    result[1].name = authData.uname;
    let token = jwt.sign(result[1], process.env.PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: '3 days'
    });

    res.send("Bearer " + token);
  });
});

module.exports = router;