 import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
   {
     userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến model User
        required: true, // bắt buộc phải có giá tr
        index: true // tạo index để tăng tốc truy vấn
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true // đảm bảo không bị trùng lặp
    },
    expiresAt: {
        type: Date,
        required: true // bắt buộc phải cso giá trị để biết khi nào token hết hạn   
    }
   },{
    timestamps: true // Tự động thêm createdAt và updatedAt
   }
);

// tự động xóa session khi hết hạn
<<<<<<< HEAD

=======
>>>>>>> master
sessionSchema.index({
    expiresAt: 1
}, {
    expireAfterSeconds: 0
})

export default mongoose.model("Session", sessionSchema) 