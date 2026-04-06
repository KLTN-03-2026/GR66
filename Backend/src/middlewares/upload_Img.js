import multer from 'multer';
import fs from 'fs';
import path from 'path';

// tạo đường dẫn tuyệt đối
const uploadPath = path.join(process.cwd(), 'src/uploads');

// hàm giải quyết vấn đề file upload sẽ được lưu ở đâu và tên file sẽ được đổi thành gì khi lưu trên server.
const storage = multer.diskStorage({
  destination: function (req, file, cb) { // req: request từ client file: thông tin file (tên, type…) cb: callback
    // tạo folder nếu chưa có
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // nếu không có lỗi lưu vào uploadPath ( thư mục uploads )
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // giữ đuôi file
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
export const upload = multer({  // chỉ được định dạng file ảnh JPG , JPEG ,PNG
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExt = /jpg|jpeg|png/;
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExt.test(ext) && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ được upload ảnh JPG, JPEG, PNG"), false);
    }
  }
}); // tạo md upload ảnh 