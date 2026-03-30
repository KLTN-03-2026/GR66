import bcrypt from 'bcrypt';
import User from '../models/users.js';
import GoogleAuthLib, { OAuth2Client } from 'google-auth-library'


// Đăng kí băng email và mật khẩu
export const signUpService = async (data) => {
    const { role, hoten, email, matkhau, sdt, gioitinh, diachi, ngaysinh } = data;
    if (!role || !hoten || !email || !matkhau || !sdt || !gioitinh || !diachi || !ngaysinh) {
        throw new Error("Thiếu dữ liệu nhập vào")
    }
    const duplicate = await User.findOne({ email })

    if (duplicate) {
        const err = new Error("Email đã tồn tại");
        err.status = 409; 
        throw err;
    }
    // mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(matkhau, 10); // salt = 10 2^10 số lần trộn
    // tạo user mới
    const newUser = await User.create({
        role,
        hoten,
        email,
        ngaysinh,
        matkhau: hashPassword,
        sdt,
        gioitinh,
        diachi
    })
    return newUser
}

//Đăng nhập bằnhg email và mật khẩu\
export const logincServices = async (data) => {
    const { email, matkhau } = data;
    if (!email || !matkhau) {
        throw new Error("Thiếu dữ liệu nhập vào")
    }
    //tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email hoặc mật khẩu không đúng")
    }
    //So sánh mật khẩu (hash)
    const isMatch = await bcrypt.compare(matkhau, user.matkhau);
    if (!isMatch) {
        throw new Error("Email hoặc mật khẩu không đúng");
    }
    // Trả dữ liệu user
    const userData = user.toObject();
    delete userData.matkhau;
    return userData;
}

// Đăng nhập với google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const loginGoogle = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload();
    const userData = {
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        googleId: payload.sub,
    }
    
    // Kiểm tra user và lưu vào db
    let user = await User.findOne({ googleId: userData.googleId });
    if (!user) {
        user = await User.create({
            hoten: userData.name,
            email: userData.email,
            googleId: userData.googleId,
            matkhau: "google-oauth", // vì login Google
            role: "user",
        });
    } else {
        // 5. Nếu có email nhưng chưa link googleId → update
        if (!user.googleId) {
            user.googleId = userData.googleId;
            await user.save();
        }
    }
}
