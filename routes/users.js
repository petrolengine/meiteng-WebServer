"use strict";

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const roomHandler = require('../handlers/RoomHandler');
const staffHandler = require('../handlers/StaffHandler');
const landlordHandler = require('../handlers/LandlordHandler');
const tenantHandler = require('../handlers/TenantHandler');
const areaHandler = require('../handlers/AreaHandler');

function __c(req, res, result, next) {
  if (!result[0]) {
    next(result[1]);
  } else {
    const ret = {
      data: result[1],
      key: req.path,
    }
    res.json(ret);
  }
}

/* GET room sale list. */
router.post('/GetRoomSaleList', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  roomHandler.get_room_sale_list(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* GET room rent list. */
router.post('/GetRoomRentList', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  roomHandler.get_room_rent_list(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* ADD sale room. */
router.post('/AddSaleRoom', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  roomHandler.add_sale_room(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* ADD rent room. */
router.post('/AddRentRoom', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  roomHandler.add_rent_room(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* GET staff list. */
router.post('/GetStaffList', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.get_staff_list(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* GET staff list2. */
router.post('/GetStaffList2', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.get_staff_list2(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* GET staff info. */
router.post('/GetStaffInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.get_staff_info(req.user, req.body.id).then((result) => __c(req, res, result, next));
});

/* SET staff info. */
router.post('/SetStaffInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.set_staff_info(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* ADD staff */
router.post('/AddStaff', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.add_staff(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* DELETE staff */
router.post('/DeleteStaff', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  staffHandler.delete_staff(req.user, req.body.id).then((result) => __c(req, res, result, next));
});

/* GET landlord list. */
router.post('/GetLandlordList', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  landlordHandler.get_landlord_list(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* GET landlord list2. */
router.post('/GetLandlordList2', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  landlordHandler.get_landlord_list2(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* GET landlord info. */
router.post('/GetLandlordInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  landlordHandler.get_landlord_info(req.user, req.body.id).then((result) => __c(req, res, result, next));
});

/* SET landlord info. */
router.post('/SetLandlordInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  landlordHandler.set_landlord_info(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* ADD landlord. */
router.post('/AddLandlord', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  landlordHandler.add_landlord(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* Quick search landlord */
router.post('/QSearchLandlord', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  landlordHandler.landlord_qsearch(req.user, req.body.key).then((result) => __c(req, res, result, next));
});

/* GET tenant list. */
router.post('/GetTenantList', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  tenantHandler.get_tenant_list(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* GET tenant list2. */
router.post('/GetTenantList2', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  tenantHandler.get_tenant_list2(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* GET tenant info. */
router.post('/GetTenantInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  tenantHandler.get_tenant_info(req.user, req.body.id).then((result) => __c(req, res, result, next));
});

/* SET tenant info. */
router.post('/SetTenantInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  tenantHandler.set_tenant_info(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* ADD tenant. */
router.post('/AddTenant', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  tenantHandler.add_tenant(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* GET area list. */
router.post('/GetAreaList', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  areaHandler.get_area_list(req.body).then((result) => __c(req, res, result, next));
});

/* GET area list. */
router.post('/GetAreaList2', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  areaHandler.get_area_list2(req.user, req.body).then((result) => __c(req, res, result, next));
});

/* ADD area. */
router.post('/AddArea', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  areaHandler.add_area(req.body).then((result) => __c(req, res, result, next));
});

/* SET area. */
router.post('/SetAreaInfo', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  areaHandler.set_area_info(req.body).then((result) => __c(req, res, result, next));
});

/* Quick search area names */
router.post('/QSearchArea', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  areaHandler.area_qsearch(req.body.key).then((result) => __c(req, res, result, next));
});

/* Search */
router.post('/Search', (req, res, next) => {
  if (!req.user) {
    next(createError(401));
    return;
  }
  switch (req.body.type) {
    case "area":
      areaHandler.search(req.body.key).then((result) => __c(req, res, result, next));
      break;
  }
});

module.exports = router;