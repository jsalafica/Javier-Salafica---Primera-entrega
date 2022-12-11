import { Router } from "express";

const router = Router();
const cart = [];

router.get("/", (req, res) => {
  const response = {
    status: "Ok",
    route: "cart",
    data: cart,
  };
  res.json(response);
});

export default router;
