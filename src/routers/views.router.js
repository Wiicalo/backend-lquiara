import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(path.join(__dirname, '../db/products.json'));


router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products: products });
    } catch (error) {
        
        res.status(500).render('error', { message: 'Error al cargar los productos en home.', error: error.message });
    }
});


router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products: products });
    } catch (error) {
         
        res.status(500).render('error', { message: 'Error al cargar los productos en tiempo real.', error: error.message });
    }
});

export default router;