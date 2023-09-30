const express = require("express");
const { upload } = require("../utils/upload");
const {
  getAllImages,
  uploadImage,
  updateDescriptionByHinh_id,
  getImageById,
  getImageByName,
  checkHasSaveImage,
  getDataLuuAnh,
  getImageHasSaveById,
  deleteImageById,
} = require('../Controllers/hinhAnhController');
const { verifyToken } = require("../utils/verifyToken");
const hinhAnhRoute = express.Router();

hinhAnhRoute.get('/getAllImages', getAllImages);
hinhAnhRoute.get('/getImageById/:hinh_id', getImageById);
hinhAnhRoute.get('/getImageByName/:ten_hinh', getImageByName);
hinhAnhRoute.post("/uploadImage", verifyToken, upload.single('image'), uploadImage);
hinhAnhRoute.post('/updateDescriptionByHinh_id/:hinh_id', verifyToken, updateDescriptionByHinh_id);
hinhAnhRoute.get('/getDataLuuAnh/', getDataLuuAnh);
hinhAnhRoute.get('/checkHasSaveImage/:hinh_id', verifyToken, checkHasSaveImage);
hinhAnhRoute.get('/getImageHasSaveById', verifyToken, getImageHasSaveById);
hinhAnhRoute.delete('/deleteImageById/:hinh_id', verifyToken, deleteImageById);

module.exports = hinhAnhRoute;