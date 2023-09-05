const Review = require('../model/Reviews')
const Product = require('../model/Product')

const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')

const createReview = async (req, res) => {
    const {product: productId } = req.body;
    
    const isValidProduct = await Product.findOne({_id: productId })
    
    if(!isValidProduct){
        throw new CustomError.NotFoundError('Product does not exist')
    }


    const alreadySubmitted = await Product.findOne({
        product: productId,
        user: req.user.UserId,
    });

    //check if the user already submitted a review
    if(alreadySubmitted){
        throw new CustomError.BadRequestError('already submitted a review for this product')
    }

    req.body.user = req.user.userId
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({ review });
}

const getAllReview = async (req, res) => {
    const reviews = await Review.find({}).populate({path:'product', select:'name company price'}).populate({path:'user', select:'name'})
    if(!reviews){
        throw new CustomError.NotFoundError('No review found')
    }
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleReview = async (req, res) => {
    const { id: productParams } = req.params;
    const productReview = await Review.findOne({ _id: productParams })
    if(!productReview){
        throw new CustomError.NotFoundError('Review not found')
    }
    res.status(StatusCodes.OK).json({ productReview })
}

const updateReview = async (req, res) => {
    const { id: reviewID } = req.params;
    const { title, comment, rating } = req.body;
    if( !title || !comment || !rating ){
        throw new CustomError.BadRequestError('Blank field, please input update info')
    }
    const reviewExist = await Review.findOne({ _id: reviewID })
    if(!reviewExist){
        throw new CustomError.NotFoundError(`No review with id: ${reviewID}, Found`)
    }
    checkPermissions(req.user, reviewExist.user)
    const updatedReview = await Review.findOneAndUpdate({ _id: reviewID }, req.body, {new: true, runValidators: true})
    if(!updatedReview){
        throw new CustomError.BadRequestError(`Review update with ID: ${reviewID} not successful`);
    }

    res.status(StatusCodes.OK).json({ updatedReview })
}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
    }
    checkPermissions(req.user, review.user);
    await review.deleteOne({ _id: reviewId });
    res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
}

const getSingleProductReview = async(req, res) =>{
    const { id: productID } = req.params;
    const reviews = await Review.findOne({ product: productID });
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
module.exports = {
    createReview,
    getAllReview,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReview
}
