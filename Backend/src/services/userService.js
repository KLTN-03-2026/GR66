import User from "../models/Users.js";

const updateUserProfile = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    ).select("-matkhau");

    if (!user) {
        throw new Error("Không tìm thấy user");
    }

    return user;
};

export default {
    updateUserProfile
};