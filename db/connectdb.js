import mongoose from "mongoose";

const connectdb = (url) => {
  return mongoose.connect(url);
};

export default connectdb;
