import { signUpService, loginGoogle } from "../services/authService.js";

// Đăng ký
export const signupController = async (req, res) => {
    try {
        await signUpService(req.body);

        return res.status(201).json({
            message: "Đăng kí thành công"
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
};

// Login Google
export const loginWithGoogle = async (req, res) => {
    try {
        const { token } = req.body;

        const userData = await loginGoogle(token);

        return res.status(200).json({
            success: true,
            user: userData
        });

    } catch (err) {
        console.error("Lỗi tại Backend:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};