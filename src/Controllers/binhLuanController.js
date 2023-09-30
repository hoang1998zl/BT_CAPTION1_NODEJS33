const { PrismaClient } = require("@prisma/client");
const { successCode, errorCode, failCode } = require("../Config/response");
const prisma = new PrismaClient();

const getAllComments = async (req, res) => {
  try {
    const comments = await prisma.binh_luan.findMany();

    prisma.$disconnect();
    if (comments.length > 0) {
      return successCode(
        res,
        comments,
        "Lấy danh sách bình luận thành công!"
      );
    } else {
      return failCode(res, "Không có dữ liệu!");
    }
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
};

const createComment = async (req, res) => {
  const { nguoi_dung_id } = req.user.content;
  const { hinh_id } = req.params;

  try {
    const { noi_dung } = req.body;

    const binh_luan = await prisma.binh_luan.create({
      data: {
        nguoi_dung_id: parseInt(nguoi_dung_id),
        hinh_id: parseInt(hinh_id),
        noi_dung,
      }
    });
    prisma.$disconnect();

    return successCode(
      res,
      binh_luan,
      "Bình luận thành công"
    );
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
};

module.exports = {
  getAllComments,
  createComment
}