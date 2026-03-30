import { signUpService , logincServices , loginGoogle } from "../services/authService.js";

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
        const user = await logincServices(req.body);
        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
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








