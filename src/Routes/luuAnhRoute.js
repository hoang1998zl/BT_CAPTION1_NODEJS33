const express = require("express");
const {
  saveImage,
  createComment,
} = require('../Controllers/luuAnhController');
const { verifyToken } = require("../utils/verifyToken");

const luuAnhRoute = express.Router();

luuAnhRoute.post('/saveImage/:hinh_id', verifyToken, saveImage)

module.exports = luuAnhRoute;