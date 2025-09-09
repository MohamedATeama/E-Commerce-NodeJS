import mongoose from "mongoose";

const dbConnection = () => {
  mongoose.connect(process.env.DATA_BASE_URL)
    .then(() => console.log('DB is connected'))
    .catch(err => console.log(err))
}

export default dbConnection;