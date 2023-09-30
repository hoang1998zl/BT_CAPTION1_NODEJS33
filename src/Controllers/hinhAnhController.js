const { PrismaClient } = require("@prisma/client");
const { successCode, errorCode, failCode } = require("../Config/response");
const prisma = new PrismaClient();

const uploadImage = async (req, res) => {
  const user = req.user.content;
  const { nguoi_dung_id } = user;
  const file = req.file;

  try {
    const image = await prisma.hinh_anh.create({
      data: {
        ten_hinh: file.originalname,
        duong_dan: file.path,
        nguoi_dung: {
          connect: { nguoi_dung_id }
        },
        mo_ta: "string",
      },
    });

    prisma.$disconnect();
    return successCode(
      res,
      image,
      "Upload hình ảnh thành công!"
    );
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
};

const updateDescriptionByHinh_id = async (req, res) => {

  try {
    const user = req.user.content;
    const { hinh_id } = req.params;
    const { mo_ta } = req.body;

    let hinh_anh = await prisma.hinh_anh.findFirst({
      where: {
        hinh_id: parseInt(hinh_id),
      },
    });

    if (!hinh_anh) {
      prisma.$disconnect();
      return failCode(res, "Không có dữ liệu!");
    }


    if (hinh_anh.nguoi_dung_id != user.nguoi_dung_id) {
      return failCode(res, "Không có quyền truy cập");
    }

    await prisma.hinh_anh.update({
      where: {
        hinh_id: parseInt(hinh_id),
      },
      data: {
        mo_ta,
      },
    });

    prisma.$disconnect();
    return successCode(
      res,
      // updateDescription,
      "Cập nhật thành công!"
    );
  } catch (err) {
    return errorCode(res, err.message);
  }
};

const getAllImages = async (req, res) => {
  try {
    const images = await prisma.hinh_anh.findMany();
    prisma.$disconnect();
    if (images.length > 0) {
      return successCode(
        res,
        images,
        "Lấy danh sách hình ảnh thành công!"
      );
    } else {
      return failCode(res, "Không có dữ liệu!");
    }
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
};

const getImageById = async (req, res) => {
  const { hinh_id } = req.params;
  try {
    const image = await prisma.hinh_anh.findFirst({
      where: {
        hinh_id: parseInt(hinh_id),
      },
      include: {
        nguoi_dung: true,
      }
    });

    prisma.$disconnect();
    if (image) {
      return successCode(
        res,
        image,
        "Lấy hình ảnh thành công!"
      );
    } else {
      return failCode(res, "Không có dữ liệu!");
    }
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
};

const getImageByName = async (req, res) => {
  const { ten_hinh } = req.params;
  try {
    const image = await prisma.hinh_anh.findMany({
      where: {
        ten_hinh,
      },
    });

    prisma.$disconnect();
    if (image.length > 0) {
      return successCode(
        res,
        image,
        "Lấy hình ảnh thành công!"
      );
    } else {
      return failCode(res, "Không có dữ liệu!");
    }
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
};

const getDataLuuAnh = async (req, res) => {
  try {
    const data = await prisma.luu_anh.findMany()

    prisma.$disconnect();
    if (data.length > 0) {
      return successCode(
        res,
        data,
        "Lấy dữ liệu thành công"
      );
    } else {
      return failCode(res, "Không có dữ liệu");
    }
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
}

const checkHasSaveImage = async (req, res) => {
  const { nguoi_dung_id } = req.user.content;
  const { hinh_id } = req.params;
  try {
    const luu_anh = await prisma.luu_anh.findFirst({
      where: {
        hinh_id: parseInt(hinh_id),
        nguoi_dung_id: parseInt(nguoi_dung_id),
      },
    });

    prisma.$disconnect();

    let isSaveImage = {
      isSaveImage: false,
    };

    if (!luu_anh) {
      return failCode(
        res,
        isSaveImage,
        "Chưa lưu ảnh!"
      );
    } else {
      isSaveImage = {
        isSaveImage: true,
      };
      return successCode(
        res,
        isSaveImage,
        "Đã lưu hình ảnh!"
      );
    }

  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
}

const getImageHasSaveById = async (req, res) => {
  const { nguoi_dung_id } = req.user.content;
  try {
    const list_image = await prisma.luu_anh.findMany({
      where: {
        nguoi_dung_id: parseInt(nguoi_dung_id),
      },
    });

    if (list_image.length > 0) {
      return successCode(
        res,
        list_image,
        "Lấy danh sách thành công"
      );
    } else {
      return failCode(res, "Không có dữ liệu");
    }
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
}

const deleteImageById = async (req, res) => {
  const { nguoi_dung_id } = req.user.content;
  const { hinh_id } = req.params;

  try {
    const image = await prisma.hinh_anh.findFirst({
      where: {
        hinh_id: parseInt(hinh_id),
      },
    });
    
    if (!image) {
      return failCode(res, "Hình ảnh không tồn tại hoặc không có quyền xóa");
    }
    
    await prisma.binh_luan.deleteMany({
      where:{
        hinh_id: parseInt(hinh_id),
      },
    });
    
    await prisma.luu_anh.deleteMany({
      where:{
        hinh_id: parseInt(hinh_id),
      },
    });

    await prisma.hinh_anh.delete({
      where: {
        hinh_id: parseInt(hinh_id),
      },
    });
    
    prisma.$disconnect();

    return successCode(
      res,
      "Xóa ảnh thành công"
    )
  } catch (error) {
    prisma.$disconnect();
    return errorCode(res, error.message);
  }
}

module.exports = {
  uploadImage,
  getAllImages,
  updateDescriptionByHinh_id,
  getImageById,
  getImageByName,
  getDataLuuAnh,
  checkHasSaveImage,
  getImageHasSaveById,
  deleteImageById
}