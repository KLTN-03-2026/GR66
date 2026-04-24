import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cookieParser from "cookie-parser";
import authRoute from './routes/authRoute.js'
import cors from 'cors'
import userRoute from './routes/UserJwt.js';
import { ProtetedRoute } from './middlewares/authMiddlewares.js';

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
//public routes
app.use('/api/auth', authRoute);
//private routes
app.use(ProtetedRoute); // áp dụng middleware bảo vệ cho tất cả các route sau nó
app.use('/api/users', userRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});




