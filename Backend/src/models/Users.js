import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
<<<<<<< HEAD
      trim: true,
=======
      enum: ["Admin", "user"],
      default: "user",
      required: true,
>>>>>>> master
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
<<<<<<< HEAD
    ngaysinh:  {
=======
    ngaysinh: {
>>>>>>> master
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
<<<<<<< HEAD
    
=======

>>>>>>> master
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
<<<<<<< HEAD
=======
    collection: "users",
>>>>>>> master
    timestamps: {
      createdAt: "thoigiantao",
      updatedAt: "thoigiancapnhat",
    },
  }
);

<<<<<<< HEAD
const User = mongoose.model("Users", userSchema);

export default User;
=======
const User = mongoose.model("User", userSchema);
export default User;
>>>>>>> master
