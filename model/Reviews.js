
const mongoose = require('mongoose');
const User = require('./User');

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating']
    }, 
    title: {
        type: String,
        trim: true,
        maxlength: 100,
        required: [true, 'Please provide title']
    },
    comment: {
        type: String,
        required: [true, 'Please provide review text']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    }
},
{
    timestamps: true
});

ReviewSchema.index({product:1, user:1}, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId){
    console.log(productId);
}

ReviewSchema.post('save', async function(){
    await this.constructor.calculateAverageRating(this.product);
})

ReviewSchema.post('updateOne', {document: true}, async function () {
    await this.constructor.calculateAverageRating(this.product);
});


ReviewSchema.post('deleteOne', {document: true, query: false}, async function(){
    await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);