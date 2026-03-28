import { signUpService } from "../services/authService.js";
import {
    getTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
    searchTour,
    toggleTrangThai
} from "../services/authService.js";

export const signupController = async (req, res) => {
    try {
        const user = await signUpService(req.body)
        return res.status(201).json({
            message: "Đăng kí thành công"
        })
    } catch (err) {
        return res.status(201).json({
            message: err.message
        })
    }
}


// ===== TOUR =====

// GET list
export const getToursController = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const data = await getTours(page, limit);
        res.json(data);
    } catch (err) {
        console.log(err); // 👈 THÊM DÒNG NÀY
        res.status(500).json({ message: err.message });
    }
};

// GET detail
export const getTourController = async (req, res) => {
    try {
        const tour = await getTourById(req.params.id);
        res.json(tour);
    } catch (err) {
        console.log(err); // 👈 THÊM DÒNG NÀY
        res.status(500).json({ message: err.message });
    }
};

// POST
export const createTourController = async (req, res) => {
    try {
        const tour = await createTour(req.body);
        res.json(tour);
    } catch (err) {
        console.log(err); // 👈 THÊM DÒNG NÀY
        res.status(500).json({ message: err.message });
    }
};

// PUT
export const updateTourController = async (req, res) => {
    try {
        const tour = await updateTour(req.params.id, req.body);
        res.json(tour);
    } catch (err) {
        console.log(err); // 👈 THÊM DÒNG NÀY
        res.status(500).json({ message: err.message });
    }
};

// DELETE
export const deleteTourController = async (req, res) => {
    try {
        await deleteTour(req.params.id);
        res.json({ message: "Xoá thành công" });
    } catch (err) {
        console.log(err); // 👈 THÊM DÒNG NÀY
        res.status(500).json({ message: err.message });
    }
};

// SEARCH
export const searchTourController = async (req, res) => {
    try {
        const keyword = req.query.q || "";
        const tours = await searchTour(keyword);
        res.json(tours);
    } catch (err) {
        console.log(err); // 👈 THÊM DÒNG NÀY
        res.status(500).json({ message: err.message });
    }
};

// TOGGLE
export const toggleTrangThaiController = async (req, res) => {
    try {
        const tour = await toggleTrangThai(req.params.id);
        res.json(tour);
    } catch (err) {
        console.log(err); // 👈 THÊM DÒNG NÀY
        res.status(500).json({ message: err.message });
    }
};