import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      trim: true,
    },

    hoten: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    ngaysinh:  {
      type: Date,
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
    },

    gioitinh: {
      type: String,
      enum: ["Nam", "Nu"],
    },

    diachi: {
      type: String,
    },

    trangthai: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "users",
    timestamps: {
      createdAt: "thoigiantao",
      updatedAt: "thoigiancapnhat",
    },
  }
);

const User = mongoose.model("User", userSchema);
export default User;
