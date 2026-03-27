import { signUpService } from "../services/authService.js";

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

