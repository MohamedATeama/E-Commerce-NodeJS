import mongoose from "mongoose";

const dbConnection = () => {
  mongoose.connect("mongodb+srv://MohammedTeama:1Vvk5aNxHX7V3CtY@project.a5v7n.mongodb.net/e-commerce1")
    .then(() => console.log('DB is connected'))
    .catch(err => console.log(err))
}

export default dbConnection;