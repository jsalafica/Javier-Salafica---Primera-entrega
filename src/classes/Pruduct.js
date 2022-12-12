class Product {
  constructor(id, timestamp, nombre, descripcion, codigo, foto, precio, stock) {
    this.id = id;
    this.timestamp = timestamp;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.codigo = codigo;
    this.foto = foto;
    this.precio = precio;
    this.stock = stock;
  }
  static updateProduct(id, products) {
    const indexProductToUpdate = products.findIndex(
      (product) => product.id === id
    );

    if (indexProductToUpdate === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return products.splice(indexProductToUpdate, 1, {
      id,
      timestamp,
      nombre,
      descripcion,
      codigo,
      foto,
      precio,
      stock,
    });
  }
  static findProduct(id, products) {
    const product = products.find((product) => product.id === Number(id));
    return product;
  }
}
export default Product;
