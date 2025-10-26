import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import productModel from '../models/product.model.js';

let mongoServer;


const seedProducts = async () => {
    const productsCount = await productModel.countDocuments();
    if (productsCount === 0) {
        console.log('Insertando productos de prueba...');
        const products = [
           
            { titulo: 'Foco Inteligente WiFi"', descripcion: 'Foco LED RGB con control WiFi desde app móvil.', codigo: 'FOCO001', precio: 19.99, cantidad: 100, categoria: 'Iluminación', status: true },
            { titulo: 'Sensor de Humedad', descripcion: 'Sensor WiFi para medir humedad y temperatura en interiores.', codigo: 'SH001', precio: 35.50, cantidad: 75, categoria: 'Climatización', status: true },
            { titulo: 'Enchufe Inteligente', descripcion: 'Enchufe con control remoto y temporizador, compatible con asistentes de voz.', codigo: 'ENC002', precio: 29.00, cantidad: 50, categoria: 'Automatización"', status: true },
            
            
        ];
        await productModel.insertMany(products);
        console.log('Productos de prueba insertados.');
    }
};


export const connectDB = async () => {
    try {
       
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        await mongoose.connect(mongoUri);
        console.log('Conexión exitosa a MongoDB (Memory Server).');
        
       
        await seedProducts();
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1); 
    }
};
