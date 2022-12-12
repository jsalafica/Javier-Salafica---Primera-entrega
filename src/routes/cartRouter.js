import { Router } from "express";
import Cart from "../classes/Cart.js";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();
const cart = [];
let products = [];

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

router.route("/").post(checkIfAdmin, (req, res) => {
  let newCartId;
  if (cart.length == 0) {
    newCartId = 1;
  } else {
    newCartId = cart[cart.length - 1].id + 1;
  }
  products = [];
  const newCart = new Cart(newCartId, Date.now(), products);
  cart.push(newCart);
  const response = {
    status: "Created",
    data: newCart,
  };
  res.status(201).json(response);
});

router
  .route("/:id/productos")
  .get((req, res) => {
    const { id } = req.params;
    const carr = cart.find((car) => car.id === Number(id));

    if (!carr) {
      const response = {
        error: "Carrito no encontrado",
      };
      res.status(404).json(response);
    } else {
      res.status(200).json(carr);
    }
  })
  .post(checkIfAdmin, (req, res) => {
    const { id } = req.params;
    const carr = cart.find((car) => car.id === Number(id));
    // console.log(carr);
    if (!carr) {
      const response = {
        error: "Carrito no encontrado",
      };
      res.status(404).json(response);
    } else {
      const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
      let newProductId;
      // const idCart = Number(id - 1);
      const idCart = cart.findIndex((cart) => cart.id === Number(id));
      if (cart[idCart].products.length == 0) {
        newProductId = 1;
      } else {
        newProductId =
          cart[idCart].products[cart[idCart].products.length - 1].id + 1;
      }
      const newProduct = {
        id: newProductId,
        timestamp: Date.now(),
        nombre: nombre,
        descripcion: descripcion,
        codigo: codigo,
        foto: foto,
        precio: precio,
        stock: stock,
      };

      cart[idCart].products.push(newProduct);
      // console.log(cart[idCart].products);
      // cart.splice(idCart, 0, products);
      res.status(200).json(cart);
    }
  });

router.route("/:id").delete((req, res) => {
  const { id } = req.params;
  const indexCartToDelete = cart.findIndex((cart) => cart.id === Number(id));
  if (indexCartToDelete === -1) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  cart.splice(indexCartToDelete, 1);
  res.status(200).json({ status: "Deleted", id: id });
});

router.route("/:id/productos/:id_prod").get((req, res) => {
  const { id, id_prod } = req.params;
  const indexCartToDelete = cart.findIndex((cart) => cart.id === Number(id));
  if (indexCartToDelete === -1) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  const indexCartToDeleteProduct = cart.findIndex(
    (cart) => cart[indexCartToDelete] === Number(id_prod)
  );
  res
    .status(200)
    .json({ id: indexCartToDelete, id_prod: indexCartToDeleteProduct });
});

export default router;
