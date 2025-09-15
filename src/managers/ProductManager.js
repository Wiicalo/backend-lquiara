import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async #readProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw new Error(`Error al leer los productos: ${error.message}`);
        }
    }

    async #writeProducts(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
            throw new Error(`Error al escribir los productos: ${error.message}`);
        }
    }

    async getProducts() {
        return await this.#readProducts();
    }

    async getProductById(id) {
        const products = await this.#readProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error(`No se encontró ningún producto con el ID: ${id}`);
        }
        return product;
    }

    
    async addProduct(productData) {
        const products = await this.#readProducts();
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1, 
            status: true, 
            thumbnails: [], 
            ...productData
        };

        
        const { titulo, descripcion, codigo, precio, cantidad, categoria } = newProduct;

       
        if (!titulo || !descripcion || !codigo || !precio || !cantidad || !categoria) {
            
            throw new Error('Todos los campos obligatorios (titulo, descripcion, codigo, precio, cantidad, categoria) son requeridos.');
        }

        products.push(newProduct);
        await this.#writeProducts(products);
        return newProduct;
    }

    
    async updateProduct(id, updatedFields) {
        const products = await this.#readProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error(`No se encontró ningún producto con el ID: ${id} para actualizar.`);
        }

        delete updatedFields.id;

        products[index] = { ...products[index], ...updatedFields };
        await this.#writeProducts(products);
        return products[index];
    }

    
    async deleteProduct(id) {
        let products = await this.#readProducts();
        const initialLength = products.length;
        products = products.filter(p => p.id !== id);

        if (products.length === initialLength) {
            throw new Error(`No se encontró ningún producto con el ID: ${id} para eliminar.`);
        }

        await this.#writeProducts(products);
        return { message: `Producto con ID ${id} eliminado exitosamente.` };
    }
}

export default ProductManager;