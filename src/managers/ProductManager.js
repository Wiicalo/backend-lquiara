import productModel from '../models/product.model.js';

class ProductManager {
    constructor() {
        console.log('ProductManager inicializado con MongoDB.');
    }

    
    async getProducts(filter, options) {
        try {
            
            const result = await productModel.paginate(filter, options);
            return result;
        } catch (error) {
            console.error("Error al obtener productos de MongoDB:", error);
            throw new Error("Error al obtener productos.");
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id).lean();
            if (!product) {
                throw new Error(`Producto con ID ${id} no encontrado.`);
            }
            return product;
        } catch (error) {
            console.error("Error al obtener producto por ID:", error.message);
            throw new Error("Error al obtener producto por ID.");
        }
    }

    async addProduct(productData) {
       
        const requiredFields = ['titulo', 'descripcion', 'codigo', 'precio', 'cantidad', 'categoria'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                throw new Error(`El campo '${field}' es obligatorio.`);
            }
        }

        try {
            const newProduct = await productModel.create(productData);
            return newProduct;
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
            
            if (error.code === 11000) { 
                throw new Error("El código de producto ya existe.");
            }
            throw new Error("Error interno al agregar el producto.");
        }
    }

    async updateProduct(id, updates) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedProduct) {
                throw new Error(`Producto con ID ${id} no encontrado para actualizar.`);
            }
            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar producto:", error.message);
            throw new Error("Error al actualizar producto.");
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error(`Producto con ID ${id} no encontrado para eliminar.`);
            }
            return deletedProduct;
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
            throw new Error("Error al eliminar producto.");
        }
    }
}

export default ProductManager;