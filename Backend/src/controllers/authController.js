
import { signUpService , logincServices , loginGoogle ,logoutService} from "../services/authService.js";
import {REFRESH_TOKEN_TTL} from "../constants/Auth.js";


// Đăng ký
export const signupController = async (req, res) => {
    try {
        await signUpService(req.body);

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
        });
    }
};


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
        const refreshToken  = req.cookies?.refreshToken;
        // gọi service để xóa session và cookie
        await logoutService(refreshToken);
        //xóa cookie
        res.clearCookie("refreshToken");
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

