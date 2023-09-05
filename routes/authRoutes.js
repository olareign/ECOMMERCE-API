const express = require('express')
const router = express.Router();

const {
    register,
    login,
    logout
} = require('../controller/authController')

const {
    getAllUsers,
    getsingleUser,
    updateUser,
    showCurrentUser,
    updateUserPassword
} = require('../controller/userController')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)

router.route('/').get(getAllUsers).get(getsingleUser).patch(updateUser).get(showCurrentUser).patch(updateUserPassword)

module.exports = router