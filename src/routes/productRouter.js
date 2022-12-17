import { Router } from "express";
import Product from "../classes/Pruduct.js";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const products = [];

//Check if admin
const admin = true;
const checkIfAdmin = (req, res, next) => {
  if (admin) {
    next();
  } else {
    res.json({
      error: -1,
      descripcion: `ruta ${req.path} metodo ${req.method} no autorizada `,
    });
  }
};

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
  .post(checkIfAdmin, (req, res) => {
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
    fs.writeFileSync(
      join(__dirname, "products.txt"),
      JSON.stringify(products, null, 2),
      (error) => {
        if (error) {
          throw new Error(`Error al escribir el archivo: ${error}`);
        }
        console.log("Escritura exitosa");
      }
    );

    res.status(201).json(response);
  });

router
  .route("/:id")
  .get((req, res) => {
    const { id } = req.params;
    const product = Product.findProduct(id, products);

    if (!product) {
      const response = {
        error: "Producto no encontrado",
      };
      res.status(404).json(response);
    } else {
      res.status(200).json(product);
    }
  })
  .put(checkIfAdmin, (req, res) => {
    let { id } = req.params;
    id = Number(id);
    const timestamp = Date.now();
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    const indexProductToUpdate = products.findIndex(
      (product) => product.id === id
    );
    if (indexProductToUpdate === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    products.splice(indexProductToUpdate, 1, {
      id,
      timestamp,
      nombre,
      descripcion,
      codigo,
      foto,
      precio,
      stock,
    });
    fs.writeFileSync(
      join(__dirname, "products.txt"),
      JSON.stringify(products, null, 2)
    );
    res
      .status(200)
      .json({ status: "Updated", data: products[indexProductToUpdate] });
  })
  .delete(checkIfAdmin, (req, res) => {
    const { id } = req.params;
    const indexProductToDelete = products.findIndex(
      (product) => product.id === Number(id)
    );
    if (indexProductToDelete === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    products.splice(indexProductToDelete, 1);
    fs.writeFileSync(
      join(__dirname, "products.txt"),
      JSON.stringify(products, null, 2)
    );
    res.status(200).json({ status: "Deleted" });
  });

export default router;
