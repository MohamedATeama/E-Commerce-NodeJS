import globalError from '../middlewares/globalError.js';
import ApiError from '../utils/apiError.js';
import addressRouter from './address/address.routes.js';
import authRouter from './auth/auth.routes.js';
import brandRouter from './brand/brand.routes.js';
import cartRouter from './cart/cart.routes.js';
import categoryRouter from './category/category.routes.js';
import couponRouter from './coupon/coupon.routes.js';
import orderRouter from './order/order.routes.js';
import productRouter from './product/product.routes.js';
import reviewRouter from './review/review.routes.js';
import subcategoryRouter from './subcategory/subcategory.routes.js';
import userRouter from './user/user.routes.js';
import wishlistRouter from './wishlist/wishlist.routes.js';

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subcategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/address", addressRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/carts", cartRouter);
  app.use("/api/v1/orders", orderRouter);
  app.all("*", (req, res, next) => {
    next(new ApiError(`Can't Find this route: ${req.originalUrl}`, 400));
  });
  app.use(globalError);
}

export default mountRoutes;