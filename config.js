import mongoose from "mongoose";
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("db connectd");
  } catch (err) {
    console.log(err);
  }
};

export default connectDb;
