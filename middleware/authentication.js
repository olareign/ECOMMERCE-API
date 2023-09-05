const CustomError = require('../errors')
const {isTokenValid} = require('../utils')


const authenticateUser = async (req, res, next ) => {
    const token = req.signedCookies.Token;

    if(!token){
        throw new CustomError.UnauthenticatedError('Authentication Failed')
    } 

    try {
        const {name, userId, role} = isTokenValid({ token })
        req.user = {name, userId, role}
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Failed')
    }

}

const unauthorizePermission = (...roles) => {
    return (req, res, next ) => {
        if(!roles.includes(req.user.role)){
        throw new CustomError.UnauthorizeError('Unauthorize Access to this site')
    }
    next();
    }
}


module.exports = {
    authenticateUser,
    unauthorizePermission,
}