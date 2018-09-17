var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* POST do login. */
router.post('/login', (req, res) => {
  let token = jwt.sign({ id: 123, username: 'test' }, process.env.PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '3 days'
  });
  res.send("Bearer " + token);
});

/* POST do regist. */
router.post('/regist', (req, res) => {
  res.send('success.');
});

module.exports = router;
