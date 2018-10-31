"use strict";

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const roomHandler = require('../handlers/RoomHandler').instance;
const staffHandler = require('../handlers/StaffHandler').instance;
const landlordHandler = require('../handlers/LandlordHandler').instance;
const tenantHandler = require('../handlers/TenantHandler').instance;

function __c(res, result, next) {
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
  roomHandler.get_room_info(req.user, req.body.offset).then((result) => __c(res, result, next));
});

/* GET staff list. */
router.post('/GetStaffList', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.get_staff_list(req.user, req.body.offset).then((result) => __c(res, result, next));
});

/* GET staff info. */
router.post('/GetStaffInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.get_staff_info(req.user, req.body.id).then((result) => __c(res, result, next));
});

/* SET staff info. */
router.post('/SetStaffInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.set_staff_info(req.user, req.body).then((result) => __c(res, result, next));
});

/* ADD staff */
router.post('/AddStaff', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.add_staff(req.user, req.body).then((result) => __c(res, result, next));
});

/* DELETE staff */
router.post('/DeleteStaff', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.delete_staff(req.user, req.body.id).then((result) => __c(res, result, next));
});

/* GET landlord list. */
router.post('/GetLandlordList', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  landlordHandler.get_landlord_list(req.user, req.body.offset).then((result) => __c(res, result, next));
});

/* GET landlord info. */
router.post('/GetLandlordInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  landlordHandler.get_landlord_info(req.user, req.body.id).then((result) => __c(res, result, next));
});

/* SET landlord info. */
router.post('/SetLandlordInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  landlordHandler.set_landlord_info(req.user, req.body).then((result) => __c(res, result, next));
});

/* ADD landlord. */
router.post('/AddLandlord', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  landlordHandler.add_landlord(req.user, req.body).then((result) => __c(res, result, next));
});

/* GET tenant list. */
router.post('/GetTenantList', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  tenantHandler.get_tenant_list(req.user, req.body.offset).then((result) => __c(res, result, next));
});

/* GET tenant info. */
router.post('/GetTenantInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  tenantHandler.get_tenant_info(req.user, req.body.id).then((result) => __c(res, result, next));
});

/* SET tenant info. */
router.post('/SetTenantInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  tenantHandler.set_tenant_info(req.user, req.body).then((result) => __c(res, result, next));
});

/* ADD tenant. */
router.post('/AddTenant', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  tenantHandler.add_tenant(req.user, req.body).then((result) => __c(res, result, next));
});

module.exports = router;