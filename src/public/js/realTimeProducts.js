const socket = io(); 


function renderProducts(products) {
    const realTimeProductList = document.getElementById('realTimeProductList');
    if (!realTimeProductList) return;

    let productListUl = document.getElementById('productListUl');
    if (!productListUl) {
        productListUl = document.createElement('ul');
        productListUl.id = 'productListUl';
        realTimeProductList.innerHTML = ''; 
        realTimeProductList.appendChild(productListUl);
    } else {
        productListUl.innerHTML = ''; 
    }

    if (products.length > 0) {
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${product.titulo}</strong> (ID: ${product.id}) - ${product.descripcion}
                <br>Precio: $${product.precio} | Cantidad: ${product.cantidad} | Categoría: ${product.categoria}
            `;
            productListUl.appendChild(li);
        });
    } else {
        productListUl.innerHTML = '<p>No hay productos en tiempo real.</p>';
    }
}

socket.on('updateProducts', (products) => {
    console.log('Productos actualizados recibidos por socket:', products);
    renderProducts(products);
});

socket.on('error', (data) => {
    console.error('Error del servidor via socket:', data.message);
    alert(`Error: ${data.message}`); 
});



const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newProduct = {
            titulo: document.getElementById('titulo').value,
            descripcion: document.getElementById('descripcion').value,
            codigo: document.getElementById('codigo').value,
            precio: parseFloat(document.getElementById('precio').value),
            cantidad: parseInt(document.getElementById('cantidad').value),
            categoria: document.getElementById('categoria').value,
            
        };

        if (
            isNaN(newProduct.precio) || newProduct.precio <= 0 || 
            isNaN(newProduct.cantidad) || newProduct.cantidad < 0 || 
            !newProduct.categoria
        ) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        socket.emit('addProduct', newProduct);

        socket.on('addProductSuccess', () => {
            addProductForm.reset();
            alert('Producto agregado con éxito.');
        });

        socket.on('addProductError', (error) => {
            alert(`Error al agregar el producto: ${error.message}`);
        });
    });
}


const deleteProductForm = document.getElementById('deleteProductForm');
if (deleteProductForm) {
    deleteProductForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const productIdToDelete = parseInt(document.getElementById('deleteId').value);
        if (isNaN(productIdToDelete)) {
            alert('Por favor, introduce un ID de producto válido.');
            return;
        }

        socket.emit('deleteProduct', productIdToDelete);

        socket.on('deleteProductSuccess', () => {
            deleteProductForm.reset();
            alert('Producto eliminado con éxito.');
        });

        socket.on('deleteProductError', (error) => {
            alert(`Error al eliminar el producto: ${error.message}`);
        });
        socket.emit('deleteProduct', productIdToDelete);
        deleteProductForm.reset();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const initialProductsElement = document.getElementById('productListUl');
    if (initialProductsElement && initialProductsElement.children.length > 0) {
       
    } else {
       
        const realTimeProductList = document.getElementById('realTimeProductList');
        if (realTimeProductList && !productListUl) { 
             realTimeProductList.innerHTML = '<p>No hay productos en tiempo real.</p>';
        }
    }
});