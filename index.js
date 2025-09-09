import express from 'express'
import dbConnection from './config/database.js'
import mountRoutes from './modules/bootstrap.js'
import dotenv from 'dotenv'
import cors from 'cors';
import expressAsyncHandler from 'express-async-handler';

dotenv.config()
const port = process.env.PORT || 3000;
const app = express();

app.post('api/webhook', express.json({ type: 'application/json' }), expressAsyncHandler((req, res) => {
    const signature = req.headers['stripe-signature'].toString();
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        "whsec_92qK4GKgMjjsUAQLuau4ycAoc3WsxKEg"
      );
      let checkout 
  if (event.type == "checkout.session.completed") {
        checkout = event.data.object
      }

    res.json({ message: "success", data: checkout });
}));

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