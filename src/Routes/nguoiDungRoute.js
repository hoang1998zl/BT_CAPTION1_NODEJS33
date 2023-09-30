const express = require("express");
const { upload } = require("../utils/upload");
const {
  getAllUsers,
  loginUser,
  createUser,
  uploadAvatar,
  updateUser,
  deleteUser,
  getUserById,
  getUserByToken,
} = require('../Controllers/nguoiDungController');
const { verifyToken } = require("../utils/verifyToken");
const nguoiDungRoute = express.Router();

nguoiDungRoute.post("/createUser", createUser);
nguoiDungRoute.post('/login', loginUser);
nguoiDungRoute.get('/getAllUsers', getAllUsers);
nguoiDungRoute.get('/getUserByToken', verifyToken, getUserByToken);
nguoiDungRoute.get('/getUserById/:nguoi_dung_id', getUserById);
nguoiDungRoute.post('/uploadAvatar', verifyToken, upload.single('avatar'), uploadAvatar);
nguoiDungRoute.put('/updateUser/:nguoi_dung_id', updateUser);
nguoiDungRoute.delete('/deleteUser/:nguoi_dung_id', deleteUser);

module.exports = nguoiDungRoute;