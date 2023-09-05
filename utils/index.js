const { createJWT, isTokenValid, attachCookiesToResponse } = require('../utils/jwt')
const {createTokenUser} =require('./createTokenUser')
const { checkPermissions } =require('./checkPermission')

module.exports = {
    createTokenUser,
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    checkPermissions
};