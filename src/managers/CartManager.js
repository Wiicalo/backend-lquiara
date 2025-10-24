import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

class CartManager {
    constructor() {
        console.log('CartManager inicializado con MongoDB.');
    }

    
    async createCart() {
        try {
            const newCart = await cartModel.create({});
            return newCart;
        } catch (error) {
            console.error("Error al crear carrito:", error);
            throw new Error("Error interno al crear el carrito.");
        }
    }

    
    async getCartById(cartId) {
        try {
            
            const cart = await cartModel.findById(cartId).populate('products.product').lean();
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener carrito por ID:", error.message);
            throw new Error("Error al obtener el carrito.");
        }
    }

    
    async addProductToCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado.`);

            const productExists = await productModel.findById(pid);
            if (!productExists) throw new Error(`Producto con ID ${pid} no encontrado.`);

            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

            if (productIndex !== -1) {
               
                cart.products[productIndex].quantity++;
            } else {
                
                cart.products.push({ product: pid, quantity: 1 });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error.message);
            throw new Error("Error al modificar el carrito.");
        }
    }

    
    async updateCartProducts(cid, newProductsArray) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado.`);

            
            cart.products = newProductsArray;
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar productos del carrito:", error.message);
            throw new Error("Error al actualizar el carrito.");
        }
    }

    
    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado.`);

            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

            if (productIndex === -1) {
                throw new Error(`Producto con ID ${pid} no encontrado en el carrito.`);
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar cantidad del producto:", error.message);
            throw new Error("Error al actualizar la cantidad del producto.");
        }
    }

    
    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado.`);

            const initialLength = cart.products.length;

           
            cart.products = cart.products.filter(p => p.product.toString() !== pid);

            if (cart.products.length === initialLength) {
                throw new Error(`Producto con ID ${pid} no encontrado en el carrito.`);
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error.message);
            throw new Error("Error al eliminar producto del carrito.");
        }
    }

    
    async deleteAllProducts(cid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado.`);

            cart.products = []; 
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al vaciar el carrito:", error.message);
            throw new Error("Error al vaciar el carrito.");
        }
    }
}

export default CartManager;