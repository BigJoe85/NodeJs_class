//Step 1 and 2- create an auth.js file and import jws from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import { User } from "../Models/userSchema.js"


const auth = async (req, res, next) => {
    //Step 3 - Get token from request headers
    const token = req.headers.authorization.split(" ")[1];

    // Step 4 - If token does not exist, return an error
    if (!token) {
        return res.status(403).json({
            status: "Failed",
            message: "Authorization token not found"
        })
    }

    // Step 5 - Verify the token using jwt
    const verified = jwt.verify(token, process.env.JWT_SECRET) // jwt.verify is a jwt method, it takes 2 parameters (1) the token (2) and our jwt_secret from .env file

    let user = await User.findById(verified.id)
    if (!user) {
        return res.status(403).json({
            status: "Failed",
            message: "user not found"
        })
    }
    // Step 6 - Make the request user equal to the verified user
    req.user = user

    //Step 7 - Call the next function
    next()

}
//Step 8 -  Export the middleware
export default auth;