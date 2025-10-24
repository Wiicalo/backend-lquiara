import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import productModel from '../models/product.model.js'; 

const router = Router();
const productManager = new ProductManager(); 

router.get('/', async (req, res) => {
    try {
       
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort; 
        const category = req.query.category;
        const status = req.query.status;

        
        let filter = {};
        if (category) {
            filter.category = category;
        }
        if (status !== undefined) {
            
            filter.status = status.toLowerCase() === 'true';
        }

        
        let options = {
            page: page,
            limit: limit,
            lean: true, 
            customLabels: {
                totalPages: 'totalPages',
                prevPage: 'prevPage',
                nextPage: 'nextPage',
                page: 'page',
                hasPrevPage: 'hasPrevPage',
                hasNextPage: 'hasNextPage',
                prevLink: 'prevLink',
                nextLink: 'nextLink',
                docs: 'payload'
            }
        };

       
        if (sort === 'asc' || sort === 'desc') {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        
        // Validate filter object
        if (typeof filter !== 'object' || Array.isArray(filter)) {
            throw new Error('Invalid filter object');
        }

        // Validate options object
        if (typeof options !== 'object' || Array.isArray(options)) {
            throw new Error('Invalid options object');
        }
        if (typeof options.page !== 'number' || options.page <= 0) {
            throw new Error('Invalid page number in options');
        }
        if (typeof options.limit !== 'number' || options.limit <= 0) {
            throw new Error('Invalid limit in options');
        }

        const products = await productManager.getProducts(filter, options);

        
        const baseURL = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

        const generateLink = (baseURL, pageNumber, limit, sort, category, status) => {
            let link = `${baseURL}?page=${pageNumber}&limit=${limit}`;
            if (sort) link += `&sort=${sort}`;
            if (category) link += `&category=${category}`;
            if (status !== undefined) link += `&status=${status}`;
            return link;
        };

        
        const result = {
            status: 'success',
            payload: products.payload, 
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? generateLink(baseURL, products.prevPage, limit, sort, category, status) : null,
            nextLink: products.hasNextPage ? generateLink(baseURL, products.nextPage, limit, sort, category, status) : null,
        };

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        
        const statusCode = isValidationError(error.message) ? 400 : 500;
        res.status(statusCode).json({ status: 'error', error: error.message });
    }
});


router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        res.status(200).json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});


router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        res.status(200).json({ status: 'success', message: `Producto con ID ${req.params.pid} eliminado.` });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
});

export default router;