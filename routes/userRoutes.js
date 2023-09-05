const express = require('express')
const router = express.Router();
const {authenticateUser, unauthorizePermission } = require('../middleware/authentication')

const {
    getAllUsers,
    getsingleUser,
    updateUser,
    showCurrentUser,
    updateUserPassword
} = require('../controller/userController')

//just incase we might have different role in a larger project, lets refactor the code
router.route('/').get(unauthorizePermission('admin', 'owner'), getAllUsers)

router.route('/showMe').get(showCurrentUser)
router.route('/updateUser').patch(updateUser)
router.route('/updateUserPassword').patch(updateUserPassword)

router.route('/:id').get(getsingleUser)


module.exports = router