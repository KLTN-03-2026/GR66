import { signUpService , logincServices , loginGoogle ,logoutService} from "../services/authService.js";
import {REFRESH_TOKEN_TTL} from "../constants/Auth.js";
import otpGenerator from 'otp-generator';
import { SendMailForgotPassword } from '../utils/mailForgotPassword.js';
import userSchema from  "../models/users.js";
import otpModel from "../models/otp.model.js";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcryptjs";

export const signupController = async(req, res) => {
    try {
        const user = await signUpService(req.body)
        return res.status(201).json({
            success: true,
            message: "Đăng kí thành công",
            user
        })
    }catch(err){
        const status = err.status || 400;
        return res.status(status).json({
            success: false,
            message: err.message
        })
    }
}

export const loginController = async (req, res) => {
    try{
        const { accessToken, refreshToken, user } = await logincServices(req.body);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // dev
            sameSite: "lax",
            maxAge: REFRESH_TOKEN_TTL,
        });
        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            accessToken,
            user
        })
    } catch (err) {
        return res.status(401).json({
            message: err.message
        })

    }
}

export const loginWithGoogle = async (req, res) => {
   try{
        const { token } = req.body

        // Gọi hàm xử lý logic (đảm bảo hàm này trả về Object)
        const userData = await loginGoogle(token);
        // Trả về json để Frontend không bị lỗi SyntaxError
        return res.status(200).json({
            success: true,
            user: userData
        });

    }catch(err){
        console.error("Lỗi tại Backend:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
}

// Đăng xuất
export const logoutController = async (req, res) => {
     try {
        const token  = req.cookies?.refreshToken;
        return res.status(201).json({
            success: true,
            message: "Đăng xuất thành công",
            user
        })
    }catch(err){
        const status = err.status || 400;
        return res.status(status).json({
            success: false,
            message: err.message
        })
    }
}

//JWT
export const authMe = async (req, res) => {
    try {
        const user = req.user; // thông tin user đã được middleware xác thực gắn vào req
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Lỗi khi gọi authMw", error);
        res.status(500).json({
            message: "Lỗi hệ thống"
        });
    }
}
//Quên mật khẩu
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const findUser = await userSchema.findOne({ email });
    if (!findUser) {
        return res.status(404).json({
        message: "Email không tồn tại"
    });
    }
    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    
    const tokenForgotPassword = jwt.sign({ email }, process.env.JWT_SECRET, { 
        expiresIn: '5m' 
    });

    res.cookie("tokenForgotPassword", tokenForgotPassword, {
        httpOnly: false,
        secure: false, 
        sameSite: "strict",
        maxAge: 5 * 60 * 1000, 
    });

    await otpModel.create({
        otp,
        email,
    });

    await SendMailForgotPassword(email, otp);
    return res.status(200).json({
        message: "Mã OTP đã được gửi đến email của bạn",
        success: true
    });
}
//Verify OTP
// Verify OTP + đổi mật khẩu
export const verifyForgotPassword = async (req, res) => {
    try {
        const { otp, password } = req.body || {};
        const tokenForgotPassword = req.cookies?.tokenForgotPassword;

        console.log("BODY:", req.body);
        console.log("OTP:", otp);
        console.log("TOKEN:", tokenForgotPassword);

        if (!tokenForgotPassword || !otp || !password) {
            return res.status(400).json({
                success: false,
                message: "Bạn đang thiếu thông tin"
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(tokenForgotPassword, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng gửi lại yêu cầu"
            });
        }

        const email = decoded.email;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Token không hợp lệ"
            });
        }

        const findOtp = await otpModel.findOne({ email, otp });
        if (!findOtp) {
            return res.status(400).json({
                success: false,
                message: "Mã OTP không hợp lệ"
            });
        }

        const findUser = await userSchema.findOne({ email });
        if (!findUser) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        findUser.password = hashedPassword;

        await findUser.save();

        await otpModel.deleteMany({ email });

        res.clearCookie("tokenForgotPassword");

        return res.status(200).json({
            success: true,
            message: "Khôi phục mật khẩu thành công"
        });
    } catch (error) {
        console.error("Lỗi verifyForgotPassword:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};




