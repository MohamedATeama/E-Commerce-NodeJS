import expressAsyncHandler from "express-async-handler";
import { Cart } from "../cart/cart.model.js";
import { Order } from "./order.model.js";
import ApiError from "../../utils/apiError.js";
import { Product } from "../product/product.model.js";
import Stripe from 'stripe';
import dotenv from 'dotenv'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_API_KEY);

export const createCashOrder = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id)
  if (!cart) return next(new ApiError("cart not found!", 404))
  const order = new Order({
    user: req.user._id,
    items: cart.items,
    totalPrice: cart.totalPriceAfterDiscount || cart.totalPrice,
    chippingAddress: req.body.chippingAddress
  })
  await order.save();

  const option = cart.items.map(item => {
    return ({
      updateOne: {
        "filter": { _id: item.product },
        "update": {$inc: {sold: item.quantity, stock: -item.quantity}}
      }
    })
  })

  await Product.bulkWrite(option)

  await cart.deleteOne()

  res.json({ message: "success", data: order})
})

export const getUserOrders = expressAsyncHandler(async (req, res, next) => {
  const orders = await Order.findOne({ user: req.user._id }).populate("items.product")
  res.json({message: "success", data: orders})
})

export const getAllOrders = expressAsyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate("items.product")
  res.json({message: "success", data: orders})
})

export const createCheckoutSession = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id)
  if (!cart) return next(new ApiError("cart not found!", 404))
  let totalPrice = cart.totalPriceAfterDiscount || cart.totalPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalPrice * 100,
          product_data: {
            name: req.user.name
          }
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `https://mohamedateama.github.io/portfolio/`,
    cancel_url: `https://mohamedateama.github.io/To-Do-List/`,

    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.sippingAddress
  });
  res.json({ message: "success", data: session })
})