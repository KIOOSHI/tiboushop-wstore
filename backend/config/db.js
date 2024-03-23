import mongoose from "mongoose";

const connectDB =  async ()=> {
    try{
       await mongoose.connect(process.env.MONGO_URI)
       console.log(`Successfully connected to mongoDB`)
    }catch{
        console.error("error")
        process.exit(1)
    }
};

export default connectDB;