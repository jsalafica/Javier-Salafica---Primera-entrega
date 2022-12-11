import { Router } from "express";
import productRouter from "./productRouter.js";
import cartRouter from "./cartRouter.js";

const router = Router();

router.use("/api/productos", productRouter);
router.use("/api/carrito", cartRouter);

export default router;
