import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cookieParser from "cookie-parser";
import authRoute from './routes/authRoute.js'
import tourRoute from './routes/tourRoute.js';
import cors from 'cors'
import userRoute from './routes/UserJwt.js';
import { ProtetedRoute } from './middlewares/authMiddlewares.js';
import manageuserRoute from "./routes/manageuserRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import multer from 'multer'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
//middleware 
app.use(express.json()); // cho phép server đọc Json

app.use(cookieParser());
//public routes
app.use('/api/auth', authRoute);
app.use('/api/tours', tourRoute);  // api cho tour  
app.use( "/uploads", express.static(path.join(__dirname, "uploads")) ); // api cho hình ảnh tour
//private routes
app.use('/api/users',ProtetedRoute ,userRoute);
app.use("/api/manageuser", manageuserRoute);
app.use("/api/reviews", reviewRoute);
app.use(ProtetedRoute); // áp dụng middleware bảo vệ cho tất cả các route sau nó
app.use('/api/users', userRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});