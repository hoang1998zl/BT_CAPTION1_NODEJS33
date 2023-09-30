const express = require("express");
const nguoiDungRoute = require("./nguoiDungRoute");
const hinhAnhRoute = require("./hinhAnhRoute");
const binhLuanRoute = require("./binhLuanRoute");
const luuAnhRoute = require("./luuAnhRoute");

const rootRoute = express.Router();

rootRoute.use("/user", nguoiDungRoute);
rootRoute.use("/image", hinhAnhRoute);
rootRoute.use("/comment", binhLuanRoute);
rootRoute.use("/save", luuAnhRoute);

module.exports = rootRoute;