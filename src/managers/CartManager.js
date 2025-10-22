import fs from 'fs';
import ProductManager from './ProductManager.js';


class CartManager {
    constructor(path, productsPath) {
        this.path = path;
        this.productManager = new ProductManager(productsPath); 
    }

    async #readCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw new Error(`Error al leer los carritos: ${error.message}`);
        }
    }

    async #writeCarts(carts) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw new Error(`Error al escribir los carritos: ${error.message}`);
        }
    }

    
    async createCart() {
        const carts = await this.#readCarts();
        const newCart = {
            id: carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1, 
            products: []
        };
        carts.push(newCart);
        await this.#writeCarts(carts);
        return newCart;
    }

   
    async getCartProducts(cartId) {
        const carts = await this.#readCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) {
            throw new Error(`No se encontró ningún carrito con el ID: ${cartId}`);
        }
        return cart.products;
    }

    
    async addProductToCart(cartId, productId) {
        const carts = await this.#readCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            throw new Error(`No se encontró ningún carrito con el ID: ${cartId}`);
        }

       
        try {
            await this.productManager.getProductById(productId);
        } catch (error) {
            throw new Error(`El producto con ID ${productId} no existe. No se puede agregar al carrito.`);
        }

        const cart = carts[cartIndex];
        const productInCartIndex = cart.products.findIndex(p => p.product === productId);

        if (productInCartIndex !== -1) {
            
            cart.products[productInCartIndex].quantity++;
        } else {
            
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.#writeCarts(carts);
        return cart;
    }
}

export default CartManager;