import jwt from "jsonwebtoken"

export const accessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRES_IN})
}

export const refreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN})
}

