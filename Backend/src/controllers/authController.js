import { signUpService , loginGoogle} from "../services/authService.js";

export const signupController = async(req, res) => {
    try {
        const user = await signUpService(req.body)
        return res.status(201).json({
            message: "Đăng kí thành công"
        })
    }catch(err){
        return res.status(201).json({
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






