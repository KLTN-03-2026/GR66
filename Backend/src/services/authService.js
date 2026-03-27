import bcrypt from 'bcrypt';
import User from '../models/users.js';

export const signUpService = async (data) => {
    const { role, hoten, email, matkhau, sdt, gioitinh, diachi } = data;
    if (!role || !hoten || !email || !matkhau || !sdt || !gioitinh || !diachi) {
        throw new Error("Thiếu dữ liệu nhập vào")
    }
    const duplicate = await User.findOne({ email })

    if (duplicate) {
        throw new Error("Email đã tồn tại")
    }
    // mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(matkhau, 10); // salt = 10 2^10 số lần trộn
    // tạo user mới
    const newUser = await User.create({
        role,
        hoten,
        email,
        matkhau: hashPassword,
        sdt,
        gioitinh,
        diachi
    })
    // return 
    return newUser;
}
