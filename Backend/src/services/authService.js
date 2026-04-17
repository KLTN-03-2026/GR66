import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import GoogleAuthLib, { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/session.js';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "../constants/Auth.js";

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
        role: "user",
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
    // Nếu khớp , tạo access token ( debug)
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    // Nếu khớp , tạo access token
    const  accessToken = jwt.sign({userId: user._id,}, process.env.JWT_SECRET, {expiresIn: ACCESS_TOKEN_TTL});
    // tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');  // tạo token ngẫu nhiên
    // tạo session lưu refresh token vào db
    await Session.create({
        userID: user._id,  // lưu ý đoạn này
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    })
    // trả refresh token và access token về cho client ==> phần này code bên controller
    const userData = user.toObject();
    delete userData.matkhau;
    // Trả về access token và thông tin user (không bao gồm mật khẩu)
    return { accessToken, refreshToken, user: userData };
}

// Đăng nhập hoặc đăng ký với google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const loginGoogle = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userData = {
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        googleId: payload.sub,
    };
    let user = await User.findOne({ email: userData.email });
    if (!user) {
        user = await User.create({
            hoten: userData.name,
            email: userData.email,
            googleId: userData.googleId,
            matkhau: "google-oauth",
            role: "user",
        });
    } else {
        if (!user.googleId) {
            user.googleId = userData.googleId;
            await user.save();
        }
    }


    //tạo access token
    const accessToken = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: ACCESS_TOKEN_TTL
        }
    );

    //tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // lưu session
    await Session.create({
        userID: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    //trả dữ liệu
    const userObj = user.toObject();
    delete userObj.matkhau;

    return {
        accessToken,
        refreshToken,
        user: userObj,
    };
};

// Đăng xuất
export const logoutService = async (refreshToken) => {
    if(refreshToken){
        // Xóa session khỏi database
        await Session.deleteOne({ refreshToken });
        //xóa cookie refresh token
        res.clearCookie("refreshToken");
    }
    return res.status(204);
}


