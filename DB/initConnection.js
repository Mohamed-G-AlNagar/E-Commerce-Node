import mongoose from "mongoose";
import dotnev from "dotenv";
dotnev.config({ path: "./config.env" });

const DB = process.env.DATABASE;

const initDBConnection = async () => {
  try {
    await mongoose.connect(DB);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("Error Connecting to database", error);
  }
};

export default initDBConnection;
