const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { createToken } = require('../utils/verifyToken')
const { successCode, errorCode, failCode } = require("../Config/response");
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  try {
    const data = await prisma.nguoi_dung.findMany();
    prisma.$disconnect();

    if (data.length > 0) {
      return successCode(
        res,
        data,
        "Lấy danh sách người dùng thành công!"
      );
    } else {
      return failCode(res, "Không có dữ liệu!");
    }
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
};

const getUserById = async (req, res) => {
  const { nguoi_dung_id } = req.params;
  try {
    const nguoi_dung = await prisma.nguoi_dung.findFirst({
      where: {
        nguoi_dung_id: parseInt(nguoi_dung_id),
      },
    });
    prisma.$disconnect();

    if (nguoi_dung) {
      return successCode(
        res,
        nguoi_dung,
        "Lấy người dùng thành công!"
      );
    } else {
      return failCode(res, "Không có dữ liệu!");
    }
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
};

const getUserByToken = async (req, res) => {
  const { nguoi_dung_id } = req.user.content;
  try {
    const nguoi_dung = await prisma.nguoi_dung.findFirst({
      where: {
        nguoi_dung_id: parseInt(nguoi_dung_id),
      },
    });
    prisma.$disconnect();

    if (nguoi_dung) {
      return successCode(
        res,
        nguoi_dung,
        "Lấy người dùng thành công!"
      );
    } else {
      return failCode(res, "Không có dữ liệu!");
    }
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const nguoi_dung = await prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });
    prisma.$disconnect();
    if (!nguoi_dung) {
      return failCode(res, "Không có tài khoản!");
    }

    if (password == nguoi_dung.password) {
      const token = createToken(nguoi_dung);
      return successCode(
        res,
        {
          nguoi_dung,
          token,
        },
        "Login thành công!"
      );
    } else {
      return failCode(res, "Sai password!");
    }
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
};

const createUser = async (req, res) => {
  try {
    const {
      email,
      mat_khau,
      ho_ten,
      tuoi
    } = req.body;

    const checkNguoiDung = await prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });

    if (checkNguoiDung) {
      prisma.$disconnect();
      return failCode(res, "Đã có tài khoản!");
    };
    const last_name =
      ho_ten
        .trim()
        .split(' ')
        .slice(-2);
    console.log(last_name)

    const nguoi_dung = await prisma.nguoi_dung.create({
      data: {
        email,
        mat_khau,
        ho_ten,
        tuoi,
        anh_dai_dien: `https://ui-avatars.com/api/?name=${last_name}`
      }
    });
    prisma.$disconnect();
    return successCode(
      res,
      nguoi_dung,
      "Tạo tài khoản thành công!"
    );
  } catch (error) {
    console.error(error);
    prisma.$disconnect();
    return failCode(res, "Lỗi Server!");
  }
};

const uploadAvatar = async (req, res) => {
  const user = req.user.content;
  let avatar = req.file;

  try {
    if (!avatar) {
      return failCode(res, "Không có ảnh nào được tải lên!");
    };

    const nguoi_dung = await prisma.nguoi_dung.findFirst({
      where: {
        nguoi_dung_id: user.nguoi_dung_id,
      },
    });

    if (!nguoi_dung) {
      prisma.$disconnect();
      return notFoundCode(res, "Người dùng không tồn tại!");
    };

    let uploadAvatar = await prisma.nguoi_dung.update({
      where: {
        nguoi_dung_id: nguoi_dung.nguoi_dung_id,
      },
      data: {
        anh_dai_dien: avatar.filename,
      },
    });
    prisma.$disconnect();
    return successCode(
      res,
      uploadAvatar,
      "Thêm avatar thành công!"
    );
  } catch (err) {
    return errorCode(res, err.message);
  }
};

const updateUser = async (req, res) => {
  const { nguoi_dung_id } = req.params;

  try {

    const {
      mat_khau,
      ho_ten,
      tuoi
    } = req.body;

    const nguoi_dung = await prisma.nguoi_dung.findFirst({
      where: {
        nguoi_dung_id: parseInt(nguoi_dung_id),
      },
    });

    if (!nguoi_dung) {
      prisma.$disconnect();
      return notFoundCode(res, "Người dùng không tồn tại!");
    };

    const updatedData = await prisma.nguoi_dung.update({
      where: {
        nguoi_dung_id: parseInt(nguoi_dung_id),
      },
      data: {
        mat_khau,
        ho_ten,
        tuoi,
      },
    });
    console.log(updatedData)

    prisma.$disconnect();
    return successCode(
      res,
      updatedData,
      "Cập nhật thành công!"
    );
  } catch (err) {
    return errorCode(res, err.message);
  }
};

const deleteUser = async (req, res) => {
  const { nguoi_dung_id } = req.params;

  try {

    const nguoi_dung = await prisma.nguoi_dung.findUnique({
      where: {
        nguoi_dung_id: parseInt(nguoi_dung_id),
      },
    });

    if (!nguoi_dung) {
      prisma.$disconnect();
      return notFoundCode(res, "Người dùng không tồn tại!");
    };

    await prisma.hinh_anh.deleteMany({
      where: {
        nguoi_dung_id: parseInt(nguoi_dung_id),
      },
    });

    await prisma.nguoi_dung.delete({
      where: {
        nguoi_dung_id: parseInt(nguoi_dung_id),
      },
    });

    prisma.$disconnect();
    return successCode(
      res,
      "Xóa người dùng thành công!"
    );
  } catch (err) {
    return errorCode(res, err.message);
  }
};

module.exports = {
  getAllUsers,
  getUserByToken,
  getUserById,
  getUserByToken,
  createUser,
  loginUser,
  uploadAvatar,
  updateUser,
  deleteUser,
}