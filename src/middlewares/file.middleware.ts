import multer from "@koa/multer";
import path from "path";

// 创建 storage 引擎
const storage = multer.diskStorage({
  // 设置文件保存路径
  destination: (req, file, cb) => {
    cb(null, "./static");
  },
  // 设置文件名及其后缀
  filename: (req, file, cb) => {
    // 获取文件扩展名
    const ext = path.extname(file.originalname);
    // 生成新文件名
    const filename = `${+Date.now()}.${ext}`; // 使用时间戳作为文件名
    cb(null, filename);
  },
});

// 创建 multer 实例
const upload = multer({ storage });

// 导出中间件
export const uploadAvatar = upload.single("avatar");
