// export const authMe = async (req, res) => {
//     try {
//         const user = req.user; // thông tin user đã được middleware xác thực gắn vào req
//         return res.status(200).json({
//             success: true,
//             user
//         });
//     } catch (error) {
//         console.error("Lỗi khi gọi authMw", error);
//         res.status(500).json({
//             message: "Lỗi hệ thống"
//         });
//     }
// }