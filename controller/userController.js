const User = require('../model/User') 
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors')
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils')

const getAllUsers = async (req, res) => {
    const usersDetails = await User.find({ role: 'user'}).select('-password');
    if(!usersDetails){
        throw new customError.NotFoundError('There no users with the role: user')
    }
    res.status(StatusCodes.OK).json({usersDetails, count: usersDetails.length})
}

const getsingleUser = async (req, res) => {
    const { id:userId }= req.params
    if(!req.params){
        res.status(StatusCodes.BAD_REQUEST).json('Empty params field')
    }
    const userDetails = await User.findById({_id: userId}).select('-password')
    if(!userDetails){
        throw new customError.NotFoundError('There no users with the params')
    }
    checkPermissions(req.user, userDetails._id)
    res.status(StatusCodes.OK).json({userDetails})
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if(!oldPassword || !newPassword){
        res.status(StatusCodes.BAD_REQUEST).json('Do not leave field Empty')
    }
    const {userId} = req.user
    console.log(userId);
    const user = await User.findById({ _id: userId })
    if(!user){
        throw new customError.NotFoundError('No user with the id found')
    }
    console.log(user.password);
    const isMatch = await user.comparePassword(oldPassword)
    if(!isMatch){
        res.status(StatusCodes.UNAUTHORIZED).json('Do not leave field Empty')
    }
    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({msg: 'Success! Password Updated'})
}

const updateUser = async (req, res) => {
    const {name, email} = req.body
    if(!name || !email){
        res.status(StatusCodes.BAD_REQUEST).json('Invalid input')
    }
    const user = await User.findOneAndUpdate({ _id: req.user.userId },{ email, name }, { new: true, runValidators: true });
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(StatusCodes.OK).json({user: tokenUser})
}

module.exports = {
    getAllUsers,
    getsingleUser,
    updateUser,
    showCurrentUser,
    updateUserPassword
}