import mongoose from "mongoose";
import dotenv from "dotenv"


// kết nối với db
dotenv.config({ path: "../.env" });
export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Liên kết với CSDL thành công")
    }catch(err){
        console.log(err)
        process.exit(1);
    }
}
export default connectDB;  // xuất giá trị chính của filegit
