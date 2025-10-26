import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import viewsRouter from './routers/views.router.js';
import ProductManager from './managers/ProductManager.js'; 
import { connectDB } from './db/database.js'; 



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();
const PORT = 8080;


const productManager = new ProductManager();


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));


app.use(express.static(path.join(__dirname, '/public')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/', viewsRouter);


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    console.log(`Accede a http://localhost:${PORT}`);
});


const io = new Server(httpServer);


io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado al socket');

    
    productManager.getProducts().then(products => {
        socket.emit('updateProducts', products);
    }).catch(error => {
        console.error('Error al enviar productos iniciales por socket:', error.message);
    });

    
    socket.on('addProduct', async (productData) => {
        try {
            await productManager.addProduct(productData); 
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts); 
        } catch (error) {
            console.error('Error al agregar producto via socket:', error.message);
            socket.emit('error', { message: `Error al agregar producto: ${error.message}` });
        }
    });

    
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId); 
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts); 
        } catch (error) {
            console.error('Error al eliminar producto via socket:', error.message);
            socket.emit('error', { message: `Error al eliminar producto: ${error.message}` });
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado del socket');
    });
});