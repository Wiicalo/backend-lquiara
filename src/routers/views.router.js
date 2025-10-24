// src/routes/views.router.js
import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js'; 

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();


router.get('/', async (req, res) => {
    try {
        
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort;
        const category = req.query.category;

        let filter = {};
        if (category) filter.categoria = category;

        let options = {
            page: page,
            limit: limit,
            lean: true,
        };

        if (sort === 'asc' || sort === 'desc') {
            options.sort = { precio: sort === 'asc' ? 1 : -1 };
        }

        const products = await productManager.getProducts(filter, options);

       
        const baseURL = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        const queryParams = req.query; 

        const generateLink = (pageNumber) => {
            let link = `${baseURL}?page=${pageNumber}`;
           
            for (let key in queryParams) {
                if (key !== 'page') {
                    link += `&${key}=${queryParams[key]}`;
                }
            }
            return link;
        };


        res.render('home', {
            products: products.docs, 
            page: products.page,
            totalPages: products.totalPages,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? generateLink(products.prevPage) : null,
            nextLink: products.hasNextPage ? generateLink(products.nextPage) : null,
            currentQuery: queryParams 
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error al cargar los productos en home.', error: error.message });
    }
});


router.get('/realtimeproducts', async (req, res) => {
    try {
        
        const products = await productManager.getProducts({}, { limit: 100, lean: true });
        res.render('realTimeProducts', { products: products.payload });
    } catch (error) {
         res.status(500).render('error', { message: 'Error al cargar los productos en tiempo real.', error: error.message });
    }
});


router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.render('productDetail', { product: product });
    } catch (error) {
        res.status(404).render('error', { message: `Producto ${req.params.pid} no encontrado.`, error: error.message });
    }
});


router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        
        res.render('cartDetail', { cart: cart }); 
    } catch (error) {
        res.status(404).render('error', { message: `Carrito ${req.params.cid} no encontrado.`, error: error.message });
    }
});

export default router;