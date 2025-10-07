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
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(pid);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    const productData = req.body;
    try {
        const newProduct = await productManager.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedFields = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(pid, updatedFields);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


router.delete('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    try {
        const result = await productManager.deleteProduct(pid);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;