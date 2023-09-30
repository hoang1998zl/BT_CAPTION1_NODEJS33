const express = require("express");
const {
  getAllComments,
  createComment,
} = require('../Controllers/binhLuanController');
const { verifyToken } = require("../utils/verifyToken");

const binhLuanRoute = express.Router();

binhLuanRoute.get('/getAllComments', getAllComments);
binhLuanRoute.post('/createComment/:hinh_id', verifyToken, createComment)

module.exports = binhLuanRoute;