import { Router } from "express";
import Product from "../classes/Pruduct.js";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const products = [];

router
  .route("/")
  .get((req, res) => {
    const response = {
      status: "Ok",
      route: "products",
      data: products,
    };
    res.json(response);
  })
  .post((req, res) => {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    let newProductId;
    if (products.length == 0) {
      newProductId = 1;
    } else {
      newProductId = products[products.length - 1].id + 1;
    }

    const newProduct = new Product(
      newProductId,
      Date.now(),
      nombre,
      descripcion,
      codigo,
      foto,
      precio,
      stock
    );
    const response = {
      status: "Created",
      data: newProduct,
    };

    products.push(newProduct);
    fs.writeFileSync(__dirname + "products.txt", JSON.stringify(products));

    res.status(201).json(response);
  });

export default router;
