import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js'; 

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager(); 


router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cid);
        res.status(200).json({ status: 'success', payload: cart.products });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});





router.put('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const newProductsArray = req.body.products; 
    try {
        if (!Array.isArray(newProductsArray)) {
            return res.status(400).json({ status: 'error', error: 'El cuerpo debe contener un arreglo "products".' });
        }

        const updatedCart = await cartManager.updateCartProducts(cid, newProductsArray);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});


router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body; 

    try {
        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ status: 'error', error: 'La cantidad debe ser un número entero positivo.' });
        }

        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});


router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartManager.deleteProductFromCart(cid, pid);
        res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito.', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});


router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const updatedCart = await cartManager.deleteAllProducts(cid);
        res.status(200).json({ status: 'success', message: 'Carrito vaciado exitosamente.', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

export default router;