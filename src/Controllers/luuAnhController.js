const { PrismaClient } = require("@prisma/client");
const { successCode, errorCode, failCode } = require("../Config/response");
const prisma = new PrismaClient();

const saveImage = async (req, res) => {
  const { nguoi_dung_id } = req.user.content;
  const { hinh_id } = req.params
  try {
    let saveImage = await prisma.luu_anh.create({
      data: {
        nguoi_dung_id: parseInt(nguoi_dung_id),
        hinh_id: parseInt(hinh_id),
      },
    });
    prisma.$disconnect();

    return successCode(
      res,
      saveImage,
      "Lưu ảnh thành công"
    );
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
}

module.exports = {
  saveImage
}