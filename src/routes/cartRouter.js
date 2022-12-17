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

// Crea un carrito y devuelve su Id
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
  fs.writeFileSync(
    join(__dirname, "carts.txt"),
    JSON.stringify(cart, null, 2),
    (error) => {
      if (error) {
        throw new Error(`Error al escribir el archivo: ${error}`);
      }
      console.log("Escritura exitosa");
    }
  );
  const response = {
    status: "Created",
    data: newCart,
  };
  res.status(201).json(response);
});

router
  .route("/:id/productos")
  // Lista todos los productos guardados en el carrito
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
  // Incorpora productos a un carrito
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
      fs.writeFileSync(
        join(__dirname, "carts.txt"),
        JSON.stringify(cart, null, 2)
      );
      res.status(200).json(cart);
    }
  });

// Vacía un carrito y lo elimina
router.route("/:id").delete((req, res) => {
  const { id } = req.params;
  const indexCartToDelete = cart.findIndex((cart) => cart.id === Number(id));
  if (indexCartToDelete === -1) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  cart.splice(indexCartToDelete, 1);
  fs.writeFileSync(join(__dirname, "carts.txt"), JSON.stringify(cart, null, 2));
  res.status(200).json({ status: "Deleted", id: id });
});

// Borra un producto por su id de un carrito específico
router.route("/:id/productos/:id_prod").delete(checkIfAdmin, (req, res) => {
  const { id, id_prod } = req.params;
  const indexCartToDelete = cart.findIndex((cart) => cart.id === Number(id));
  if (indexCartToDelete === -1) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  const indexCartToDeleteProduct = cart[indexCartToDelete].products.findIndex(
    (prod) => prod.id === Number(id_prod)
  );
  if (indexCartToDeleteProduct === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  cart[indexCartToDelete].products.splice(indexCartToDeleteProduct, 1);
  fs.writeFileSync(join(__dirname, "carts.txt"), JSON.stringify(cart, null, 2));
  res.status(200).json({ status: "Deleted", producto_id: Number(id_prod) });
});

export default router;
