var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var jwt = require('express-jwt');

/* GET users listing. */
router.post('/', function (req, res, next) {
  if (!req.user) {
    next(createError(401));
    return;
  }
  res.json([[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14]]);
});

module.exports = router;
