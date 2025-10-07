const socket = io(); 


function renderProducts(products) {
    const productListUl = document.getElementById('productListUl');
    if (!productListUl) return; 

    productListUl.innerHTML = ''; 

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

        
        socket.emit('addProduct', newProduct);

        addProductForm.reset(); 
    });
}


const deleteProductForm = document.getElementById('deleteProductForm');
if (deleteProductForm) {
    deleteProductForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const productIdToDelete = parseInt(document.getElementById('deleteId').value);

        
        socket.emit('deleteProduct', productIdToDelete);

        deleteProductForm.reset(); 
    });
}


document.addEventListener('DOMContentLoaded', () => {
   
});