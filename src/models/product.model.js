
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'; 

const productSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        index: true 
    },
    descripcion: {
        type: String,
        required: true
    },
    codigo: {
        type: String,
        required: true,
        unique: true 
    },
    precio: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    cantidad: { 
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        required: true,
        index: true
    },
    thumbnails: {
        type: [String],
        default: []
    }
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model('products', productSchema);

export default productModel;