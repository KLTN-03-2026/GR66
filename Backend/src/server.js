import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
<<<<<<< HEAD
import cookieParser from "cookie-parser";
import authRoute from './routes/authRoute.js'
import cors from 'cors'
=======
import authRoute from './routes/authRoute.js';
import tourRoute from './routes/tourRoute.js';
import cors from 'cors';
>>>>>>> devquan
import userRoute from './routes/UserJwt.js';
import { ProtetedRoute } from './middlewares/authMiddlewares.js';
import manageuserRoute from "./routes/manageuserRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use(cookieParser());
//public routes
=======
// xử lý __dirname cho ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// public thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// public routes
>>>>>>> devquan
app.use('/api/auth', authRoute);
app.use('/api/tours', tourRoute);

<<<<<<< HEAD
=======
// private routes
app.use('/api/users', ProtetedRoute, userRoute);
app.use("/api/manageuser", manageuserRoute);
app.use("/api/reviews", reviewRoute);

>>>>>>> devquan
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});