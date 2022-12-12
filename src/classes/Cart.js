class Cart {
  constructor(id, timestamp, products = []) {
    this.id = id;
    this.timestamp = timestamp;
    this.products = products;
  }
}
export default Cart;
