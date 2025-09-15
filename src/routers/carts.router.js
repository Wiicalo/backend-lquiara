import { Router } from 'express';
import CartManager from '../managers/CartManager.js';      
import path from 'path';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const cartManager = new CartManager(
    path.join(__dirname, '../db/carts.json'),
    path.join(__dirname, '../db/products.json') 
);


router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    try {
        const productsInCart = await cartManager.getCartProducts(cid);
        res.status(200).json(productsInCart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    try {
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;