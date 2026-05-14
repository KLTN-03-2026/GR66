import userService from '../services/userService.js';

export const authMe = async (req, res) => {
    try {
        const user = req.user;

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
};

export const UpdateProfileController = async (req, res) => {
    try {
        const userId = req.user._id;

        const updatedUser = await userService.updateUserProfile(
            userId,
            req.body
        );

        res.status(200).json({
            success: true,
            user: updatedUser
        });

    } catch (err) {
        res.status(500).json({
            message: "Lỗi cập nhật",
            error: err.message
        });
    }
};