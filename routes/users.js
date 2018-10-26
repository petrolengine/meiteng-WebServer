"use strict";

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const RoomHandler = require('../handlers/RoomHandler');
const StaffHandler = require('../handlers/StaffHandler');

function __do_result(res, result, next) {
  if (!result[0]) {
    next(result[1]);
  } else {
    res.json(result[1]);
  }
}

/* GET room info. */
router.post('/GetRoomInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  RoomHandler.instance.get_room_info(req.user, req.body.offset).then((result) => __do_result(res, result, next));
});

/* GET staff list. */
router.post('/GetStaffList', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  StaffHandler.instance.GetStaffList(req.user, req.body.offset).then((result) => __do_result(res, result, next));
});

/* GET staff info. */
router.post('/GetStaffInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  StaffHandler.instance.GetStaffInfo(req.user, req.body.id).then((result) => __do_result(res, result, next));
});

/* ADD staff */
router.post('/AddStaff', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  StaffHandler.instance.AddStaff(req.user, req.body).then((result) => __do_result(res, result, next));
});

module.exports = router;