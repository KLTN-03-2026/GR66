import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
//middleware 
app.use(express.json()); // cho phép server đọc Json

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})



