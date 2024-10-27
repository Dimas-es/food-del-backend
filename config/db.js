import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(
      'mongodb+srv://fooddel:237006090@cluster0.urpw0.mongodb.net/?'
    ).then(()=>console.log("DB Connected"));
}