import express from 'express'
import dbConnection from './config/database.js'
import mountRoutes from './modules/bootstrap.js'
import dotenv from 'dotenv'
import cors from 'cors';

dotenv.config()
const port = process.env.PORT || 3000;
const app = express();
app.use(cors())
app.use('/uploads', express.static('uploads'));
app.use(express.json());
dbConnection();

mountRoutes(app);

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

process.on("unhandledRejection", (err) => {
  console.log(`unhandled Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Server is shutting down...");
    process.exit(1);
  });
});