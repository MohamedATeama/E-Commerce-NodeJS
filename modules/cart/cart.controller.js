import expressAsyncHandler from "express-async-handler";
import { Cart } from "./cart.model.js";
import { Product } from "../product/product.model.js";
import ApiError from "../../utils/apiError.js";
import { Coupon } from "../coupon/coupon.model.js";

function calcTotalPrice(cart) {
  cart.totalPrice = cart.items.reduce((acc, item) => acc += item.quantity * item.price, 0)
  if (cart.discount) cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * cart.discount) / 100
}

export const addToCart = expressAsyncHandler(async (req, res, next) => {
  const isCartExist = await Cart.findOne({ user: req.user._id })
  const product = await Product.findById(req.body.product)
  if (!product) return next(new ApiError("product not found!", 404))
  req.body.price = product.price
  if (req.body.quantity > product.stock) return next(new ApiError("sold out", 404))
  if (!isCartExist) {
    let cart = new Cart({
      user: req.user._id,
      items: [req.body]
    })
    calcTotalPrice(cart)
    await cart.save();
    res.json({message: "success", data: cart})
  } else {
    const item = isCartExist.items.find(item => item.product == req.body.product)
    if (item) {
      item.quantity += req.body.quantity || 1
      if (item.quantity > product.stock) return next(new ApiError("sold out", 404))
    }
    if (!item) isCartExist.items.push(req.body)
    calcTotalPrice(isCartExist)
    await isCartExist.save()
    res.json({message: "success", cart: isCartExist})
  }
})

export const getCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return next(new ApiError("cart not found!", 404))
  res.json({message: "success", data: cart})
})

export const updateQuantity = expressAsyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return next(new ApiError("cart not found!", 404))
  let item = cart.items.find(item => item.product == req.params.id)
  if (!item) return next(new ApiError("product not found!", 404))
  item.quantity = req.body.quantity
  calcTotalPrice(cart)
  await cart.save();
  res.json({message: "success", data: cart})
})

export const removeFromCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { $pull: { items: { _id: req.params.id } } }, { new: true })
  calcTotalPrice(cart)
  await cart.save();
  if (!cart) return next(new ApiError("cart not found!", 404))
  res.json({message: "success"})
})

export const clearCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id })
  if (!cart) return next(new ApiError("cart not found!", 404))
  res.json({message: "success"})
})

export const applyCoupon = expressAsyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({ code: req.body.code, expire: { $gte: Date.now() } })
  if (!coupon) return next(new ApiError("coupon invalid!", 404))
  const cart = await Cart.findOne({ user: req.user._id })
  cart.discount = coupon.discount
  calcTotalPrice(cart)
  await cart.save();
  res.json({message: "success", data: cart})
})