// Mount Routes
import categoryRoutes from "./category.route.js";
import subCategoryRoutes from "./subcategory.route.js";
import brandRoutes from "./brand.route.js";
import productRoutes from "./product.route.js";
import couponRoutes from "./coupon.route.js";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import reviewRoutes from "./review.route.js";
import addressRoutes from "./address.route.js";
import wishlistRoutes from "./wishlist.route.js";
import cartRoute from "./cart.route.js";

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/subcategories", subCategoryRoutes);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/coupons", couponRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/reviews", reviewRoutes);
  app.use("/api/v1/wishlist", wishlistRoutes);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/addresses", addressRoutes);
};

export default mountRoutes;
