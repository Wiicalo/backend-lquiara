import express from 'express';
import { engine } from 'express-handlebars'; 
import { Server } from 'socket.io';         
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js  ';
import viewsRouter from './routers/views.router.js';
import ProductManager from './managers/ProductManager.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;


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

    
});

export { io };