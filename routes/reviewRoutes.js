const express = require('express')
const router = express.Router();


const { unauthorizePermission } = require('../middleware/authentication')
const {
    createReview,
    getAllReview,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controller/reviewConntroller')


router.route('/all').get(getAllReview)
router.route('/create').post(unauthorizePermission('admin', 'owner'), createReview)

router.route('/:id').delete(unauthorizePermission('admin', 'owner'), deleteReview)
router.route('/:id').patch(unauthorizePermission('admin', 'owner'), updateReview)
router.route('/:id').get( getSingleReview)

module.exports = router;