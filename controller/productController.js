const Product = require('../model/Product')
const { StatusCodes }= require('http-status-codes');
const CustomError = require('../errors')
const path = require('path');

const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create( req.body )
    res.status(StatusCodes.CREATED).json({ product })
}

const getSingleProduct = async (req, res) => {
    const { id: productId} = req.params
    if(!productId){
        throw new CustomError.BadRequestError('Please input a valid product id')
    }
    const productDetails = await Product.findOne({ _id: productId }).populate('reviews');
    if(!productDetails){
        throw new CustomError.NotFoundError('Product not found')
    }
    res.status(StatusCodes.OK).json({ product: productDetails });
};

const getAllProduct = async (req, res) => {
    const products = await Product.find({})
    if(!products){
        throw new CustomError.NotFoundError('Products not found')
    }
    res.status(StatusCodes.OK).json({ allProduct: products, count: products.length })
}

const updateProduct = async (req, res) => {
    const { id: productId } = req.params
    const product = await Product.findOneAndUpdate({_id: productId}, req.body, {new: true, runValidators: true})
    
    if (!product){
        throw new CustomError.NotFoundError(`No product with the id: ${productId}`)
    }

    res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req, res) => {
    const { id: productId } = req.params;
    
    try {
        const checkedProduct = await Product.findOne({ _id: productId });
        if (!checkedProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
        }
        await checkedProduct.deleteOne({  _id: productId })
        res.status(StatusCodes.OK).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};


const uploadImage = async (req, res) => {
    
    if(!req.files){
        throw new CustomError.BadRequestError('No file Upload')
    }
    const productImage = req.files.image;

    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('No file Upload')
    }

    const maxSize = 1024 * 1024

    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError('Please upload image smaller than 1MB')
    };

    const imagePath = path.join(__dirname,'../public/uploads/' + `${productImage.name}`)
    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })
}

module.exports = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}