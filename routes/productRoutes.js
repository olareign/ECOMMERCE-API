const express = require('express')
const router = express.Router();

const {authenticateUser, unauthorizePermission } = require('../middleware/authentication')

const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controller/productController')

const {getSingleProductReview} = require('../controller/reviewConntroller')


router.route('/all').get(getAllProduct)
router.route('/create').post(unauthorizePermission('admin', 'owner'),createProduct)
router.route('/upload').post(unauthorizePermission('admin', 'owner'),uploadImage)


router.route('/:id').delete(unauthorizePermission('admin', 'owner'), deleteProduct).patch(unauthorizePermission('admin', 'owner'), updateProduct).get(getSingleProduct)

router.route('/:id/reviews').get(getSingleProductReview)
module.exports = router