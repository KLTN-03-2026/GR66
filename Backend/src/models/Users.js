import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["Admin", "user"],
      default: "user",
      required: true,
    },

    hoten: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
    ngaysinh: {
      type: Date,
      validate: {
        validator: (v) => !v || v < new Date(),
        message: "Ngày sinh không hợp lệ",
      },
    },
    matkhau: {
      type: String,
      required: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // cho phép null mà không lỗi unique
    },

    sdt: {
      type: String,
      match: [/^[0-9]{9,11}$/, "SĐT không hợp lệ"], //
    },

    gioitinh: {
      type: String,
      enum: ["Nam", "Nu"],
    },

    diachi: {
      type: String,
    },
  },
  {
    collection: "users",
    timestamps: {
      createdAt: "thoigiantao",
      updatedAt: "thoigiancapnhat",
    },
    //tránh update lại trường __v khi cập nhật document
    versionKey: false,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;