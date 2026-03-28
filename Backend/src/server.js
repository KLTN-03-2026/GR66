import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoute from './routes/authRoute.js'
import cors from 'cors'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
//middleware 
app.use(express.json()); // cho phép server đọc Json
//public routes
app.use('/api/auth', authRoute);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});




