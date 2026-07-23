// firstly import express
import express from "express"
//importing our auth middleware
import auth from "../Middlewares/auth.js"
import admin from '../Middlewares/adminMiddleware.js'
// secondly import all our functions created and exported in the userController file 
import { addUser, loginUser, profile, getAllUsers, updateUser, deleteUser, verifyEmail, refreshTokenRoute, getLimitedUsers, getFilteredUsers } from "../Controllers/userController.js"

const Router = express.Router() // initializing the Router method

Router.route('/users')
.get(auth, admin, getAllUsers)

Router.route('/register')
.post(addUser)

Router.route('/verify-email/:token')
.get(verifyEmail)

Router.route('/login')
.post(loginUser)

Router.route('/profile')
.get(auth, profile)

Router.route('/:email')
.patch(auth, updateUser)
.delete(auth, deleteUser)

Router.route('/refresh-token')
.get(refreshTokenRoute) //Generates new access token using refresh token on expiry of the access token

Router.route('/users')
.get(auth, admin, getLimitedUsers)

Router.route('/filter')
.get(auth, admin, getFilteredUsers)


export default Router