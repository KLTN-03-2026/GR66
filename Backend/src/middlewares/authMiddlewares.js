import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

export const ProtetedRoute = async (req, res, next) => {
    try {
        // lấy token từ header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // lấy lại đằng sau Bearer

        if(!token){
            return res.status(401).json({
                message: "Không tìm thấy token, vui lòng đăng nhập"
            })
        }
        // xác nhận token có hợp lệ không
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedUser) => {  // nếu hợp lệ trả thông tin lại về cho decoded
            if(err){
                return res.status(401).json({
                    message: "Access Token hết hạn hoặc không hợp lệ"
                })
            }
            
            //tìm user theo id trong token
            const user = await User.findById(decodedUser.userId).select("-hashPassword"); // không trả về mật khẩu

            if(!user) {
                return res.status(401).json({
                    message: "User không tồn tại"
                })
            }
            // trả về thông tin user về req
            req.user = user;
            next(); // báo rằng middle ware đẫ hoàn thành và chuyển sang middleware tiếp theo
        })

    } catch (err) {
        console.log("Lỗi hệ thống",err);
        return res.status(401).json({
            message: "Lỗi hệ thống"
        })
    }
}

//53:52