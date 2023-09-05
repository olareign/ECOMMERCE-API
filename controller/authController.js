const User = require('../model/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')


const register = async (req, res) => {
        const { name, email, password} = req.body
        const checkEmail = await User.findOne({email})
        if(checkEmail){
            throw new CustomError.BadRequestError('Email already exists')
        }

        const isFirstAccount = (await User.countDocuments({})) === 0;
        const role = isFirstAccount ? "admin" : "user" ;
        const user = await User.create({ name, email, password, role})

        const tokenUser = createTokenUser(user);
    
        attachCookiesToResponse( {res, user: tokenUser})
        res.status(StatusCodes.CREATED).json({ user})
  
}

const login = async (req, res) => {
    const {email, password } = req.body
    
    if(!email || !password){
        res.status(StatusCodes.BAD_REQUEST).json('Do not leave the fields empty')
    }
    const user = await User.findOne({ email })
    if(!user){
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const tokenUser = createTokenUser(user);
    
    attachCookiesToResponse( {res, user: tokenUser})
    res.status(StatusCodes.OK).json({ user})

}

const logout = async (req, res) => {
    res.cookie('Token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg: 'User logged out'});
}

module.exports = {
    register,
    login,
    logout
}
