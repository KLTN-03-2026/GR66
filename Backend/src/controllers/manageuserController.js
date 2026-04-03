import {
    getUserStatsService,
    getAllUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    updateUserStatusService,
  } from "../services/manageuserService.js";
  
  export const getUserStats = async (req, res) => {
    try {
      const result = await getUserStatsService();
  
      return res.status(200).json({
        success: true,
        message: "Lấy thống kê tài khoản thành công",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  export const getAllUsers = async (req, res) => {
    try {
      const result = await getAllUsersService(req.query);
  
      return res.status(200).json({
        success: true,
        message: "Lấy danh sách tài khoản thành công",
        ...result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  export const getUserById = async (req, res) => {
    try {
      const result = await getUserByIdService(req.params.id);
  
      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết tài khoản thành công",
        data: result,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  export const createUser = async (req, res) => {
    try {
      const result = await createUserService(req.body);
  
      return res.status(201).json({
        success: true,
        message: "Tạo tài khoản thành công",
        data: result,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  export const updateUser = async (req, res) => {
    try {
      const result = await updateUserService(req.params.id, req.body);
  
      return res.status(200).json({
        success: true,
        message: "Cập nhật tài khoản thành công",
        data: result,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  export const updateUserStatus = async (req, res) => {
    try {
      const { trangthai } = req.body;
  
      if (typeof trangthai !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "trangthai phải là true hoặc false",
        });
      }
  
      const result = await updateUserStatusService(req.params.id, trangthai);
  
      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái tài khoản thành công",
        data: result,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  };