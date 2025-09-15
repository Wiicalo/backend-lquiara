import express from 'express';
import productsRouter from './routers/products.router.js'; 
import cartsRouter from './routers/carts.router.js';     

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.send('¡Hola Coder! Tu servidor de domótica está funcionando.');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    console.log(`Accede a http://localhost:${PORT}`);
});