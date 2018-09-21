"use strict";

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const jwt = require('express-jwt');
const RoomHandler = require('../handlers/RoomHandler');

/* GET room info. */
router.post('/GetRoomInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  console.log(req.user);
  RoomHandler.instance.get_room_info(req.user, req.body.offset).then((result) => {
    if (!result[0]) {
      next(result[1]);
      return;
    }
    res.json(result[1]);
  });
});

module.exports = router;
