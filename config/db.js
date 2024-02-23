import mongoose from "mongoose";

export const connectDB = () => {
    try {
         mongoose.connect(process.env.MONGODB_URL)

        console.log("connected")
    } catch (error) {
        console.log("Db not connected");
        console.log(error)
    }
};