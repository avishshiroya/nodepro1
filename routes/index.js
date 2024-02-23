import userRoutes from "./userRoutes.js"
import productRoutes from "./productRoutes.js"
import express from "express"
const router = express();
//user routes
router.use('/user', userRoutes);
//product routers
router.use('/product', productRoutes);

export default router