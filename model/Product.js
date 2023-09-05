const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        maxlength: [100, 'Name can not exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
        maxlength: [1000, 'Description can not exceed 1000 characters']
    },
    image: {
        type: String,
        default: '/uploads/example.jpeg',
    },
    category: {
        type: String,
        required: [true, 'Please provide product category'],
        enum: ['office', 'kitchen', 'bedroom']
    },
    company: {
        type: String,
        required: [true, 'Please provide a product company'],
        enum: ['ikea', 'liddy', 'marcos']
    },
    colors: {
        type: [String],
        default: ['#000'],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    freshShipping: {
        type: Boolean,
        default: false,
    },
    inventory: {
        type: Number,
        required: true,
        default: 15,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReview: {
        type: Number,
        default: 0,
    },
    user: { 
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, 
{ timestamps: true ,toJSON: {virtuals: true}, toObject: {virtuals: true} });

productSchema.virtual('reviews',{
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
});

productSchema.pre('deleteOne', {document: true}, async function(next){
    await this.model('Review').deleteMany({ product: this._id});
    next()
});

module.exports = mongoose.model('Product', productSchema) 