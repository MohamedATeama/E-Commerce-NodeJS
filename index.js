import express from 'express'
import dbConnection from './config/database.js'
import mountRoutes from './modules/bootstrap.js'
import dotenv from 'dotenv'
import cors from 'cors';
import expressAsyncHandler from 'express-async-handler';
import { User } from './modules/user/user.model.js';
import { Cart } from './modules/cart/cart.model.js';
import { Order } from './modules/order/order.model.js';
import ApiError from './utils/apiError.js';
import { Product } from './modules/product/product.model.js';

dotenv.config()
const port = process.env.PORT || 3000;
const app = express();

app.post('api/webhook', express.json({ type: 'application/json' }), expressAsyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature'].toString();
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        "whsec_92qK4GKgMjjsUAQLuau4ycAoc3WsxKEg"
      );
      let checkout 
  if (event.type == "checkout.session.completed") {
    checkout = event.data.object

    const user = await User.findOme({email: checkout.customer_email})
    const cart = await Cart.findById(req.params.id)
    if (!cart) return next(new ApiError("cart not found!", 404))
    const order = new Order({
      user: user._id,
      items: cart.items,
      totalPrice: checkout.amount_total / 100,
      chippingAddress: checkout.metadata,
      paymentType: "card",
      isPaid: true
    })
    await order.save();

    const option = cart.items.map(item => {
      return ({
        updateOne: {
          "filter": { _id: item.product },
          "update": { $inc: { sold: item.quantity, stock: -item.quantity } }
        }
      })
    })

    await Product.bulkWrite(option)

    await cart.deleteOne()
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