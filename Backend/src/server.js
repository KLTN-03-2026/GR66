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
import vnpayRout from './routes/vnpayRoute.js'
import cors from 'cors'
import userRoute from './routes/UserJwt.js';
import { ProtetedRoute } from './middlewares/authMiddlewares.js';
import manageuserRoute from "./routes/manageuserRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import multer from 'multer'
import userRoutes from "./routes/userRoute.js"; // đúng file
import bookingStream from "./streams/bookingStream.js";
import bookingExpireCron from "./cron/bookingExpireCron.js";
import statsRoute from "./routes/statsRoute.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
//middleware 
app.use(express.json()); // cho phép server đọc Json
app.use(cookieParser());

//public routes\
app.use('/api/vnpay', vnpayRout)
app.use('/api/auth', authRoute);
app.use('/api/tours', tourRoute);  // api cho tour  
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // api cho hình ảnh tour
//private routes
app.use('/api/users', userRoute);
app.use('/api/users', userRoutes);      // ← Chỉ mount 1 lần, đúng cách
app.use("/api/manageuser", manageuserRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/stats", statsRoute);

connectDB().then(() => {
  bookingStream();
  bookingExpireCron();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});