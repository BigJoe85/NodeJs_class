//first import mongoose from mongoose
import mongoose from "mongoose"
// import the User model created in the model file
import { User } from "../Models/userSchema.js"
import jwt from "jsonwebtoken"
import token from "../Utils/jwt.js"
import { sendVerificationEmail } from "../config/email.js"
import bcrypt from "bcrypt"



// create a function that handles registration
export const addUser = async (req, res) => {
    try {
        // get the userName, email and confirm password from the request body
        const { image, userName, email, role, password, confirmPassword } = req.body // meaning we'll be getting this from the request body

        // Check if password and confirm passwords are the same
        if (password !== confirmPassword) {
            // we only checking one condition here so no need for else, hence we use the return keyword
            return res.status(403).json({
                status: "Failed",
                message: "Password and confirmPassword must be the same"
            })
        }

        // Also check if the user already exist in the database
        const findUser = await User.findOne({ email }) // the findOne is a mongodb method that returns the first item that meets the condition
        //check if the user already exists
        if (findUser) {
            return res.status(401).json({
                status: "Failed",
                message: "User already exists"
            })
        }

        // // Encrypting our password using "Bcrypt" library, to use this import it at the top -- import bcrypt from "bcrypt"
        // let salt = await bcrypt.genSalt(10)
        // const hashedPassword = await bcrypt.hash(password, salt) // this takes 2 parameters what you want to encrypt/hash which is "password" and the salt
        //WE MOVED THIS HASHING OF THE PASSWORD TO THE userSchema file just before creating our 'User' modoel

        //Now save the user data into the database
        let user = await User.create({
            image,
            userName,
            email: email.toLowerCase(),
            role,
            password
        })

        // create a variable that will hold the verification token 
        const verificationToken = token({ id: user._id, email: user.email })
        //generate a verification link from the client url
        const verificationLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email/${verificationToken}`


        // find user by id and update the verification token
        // await User.findByIdAndUpdate(user._id, { verificationToken: verificationToken }) or
        await User.findByIdAndUpdate(user._id, { verificationToken })

        // send a verification email
        await sendVerificationEmail(user, verificationLink)



        // create an authentication token that will be returned to the user as verification token
        const authToken = token({ id: user._id })

        // return a success response
        res.status(201).json({
            status: "success",
            token: authToken,
            message: "user registered successfully. Check your email to verify your account.",
            data: user
        })
    } catch (err) {
        res.status(501).json({
            status: "failed",
            message: `unable to register user error: ${err}`
        })
    }
}


// email verification controller
export const verifyEmail = async (req, res) => {
    try {
        // get the request token from req.params
        const { token: verificationToken } = req.params;
        // decode the token(encrypted server token and client token)
        const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);

        // make the id of the user to be the decorded id 
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login`);
    } catch (error) {
        console.log("Error:", error) // add this to see the actual error
        return res.status(400).json({
            message: "Invalid or expired token."
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        // destructure the email and password from the request body
        const { email, password } = req.body;

        // check if user exists in the database
        const user = await User.findOne({ email })

        // return an error if user does not exist in the database
        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "Invalid email or password"
            })
        }

        // compare the entered password with the password in the database which is already encrypted so we'll be using bcrypt compare method to do this.
        // the bcrypt compare method takes 2 parameters, of which are the things you want to compare 
        let comparedPassword = await bcrypt.compare(password, user.password)

        // if password entered and password in the database does not mamtch, return an error
        if (!comparedPassword) {
            return res.status(403).json({
                status: "Failed",
                message: "Request Forbidden"
            })
        }

        //Create a JWT token (JSON Web Token which we already installed using npm install jsonwebtoken)
        //JWT token is made up of the header, payload and the siignature, the signature is made of up (header, payload and the secrete string)

        // in our .env file, we create our JWT_SECRET and expiration (JWT_EXPRESS_IN ) so we can call them here using 'process'
        let token = jwt.sign({ id: user?.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

        //send a response with the token and data
        res.status(200).json({
            status: "Success",
            message: "Login Successful",
            token,
            data: user
        })

    } catch (error) {
        res.status(501).json({
            status: "Failed",
            message: `Unable to login error: ${error}`
        })
    }
    // proceed to importing this function in userRoutes and creating the route that uses this function
}

//Profile controller
export const profile = (req, res) => {
    try {
        res.status(200).json({
            status: "Success",
            message: "Welcome to the profile page",
        })
    } catch (error) {
        res.status(403).json({
            status: "Failed",
            message: `Unauthorized error: ${error}`
        })
    }
}

// Get all user admin controller
export const getAllUsers = async (req, res) => {
    try {
        let users = await User.find({}).select("-password") //.select(-"password") is a mongodb method that excludes the argument given so we dont want to also include password when finding the user
        res.status(200).json({
            status: "Success",
            message: "All users retrieved",
            data: users
        })
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: `Unable to get users. Error: ${error}`
        })
    }
}

// Updating a user
export const updateUser = async (req, res) => {
    try {
        // destructure the email to be updated from the resuest parameter
        const { email } = req.params

        //initialize a variable that will hold the data in the request body
        const updateData = req.body

        //update the user using findOne and Update MongoDB method which takes 3 parameters (a) the field to update (b) data we want to update (c) validators

        const user = await User.findOneAndUpdate(
            //field to update
            { email: email.toLowerCase() },

            // Data we want to update to, this is coming from the request body
            updateData,

            // return the updated data
            { new: true }
        ).select("-password") //we are exluding the password from the selected data 

        // Run a check to validate if the user with the email exist
        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: `User with the email: ${email} not found`
            })
        }

        // return a success response if user exists
        res.status(200).json({
            status: "Success",
            message: `User with the email: ${email} updated successfully`,
            data: user
        })

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: `Internal server error: ${error}`
        })
    }
}


// //Delete a user
export const deleteUser = async (req, res) => {
    try {
        // destructure the email to be updated from the resuest parameter
        const { email } = req.params

        const user = await User.findOneAndDelete({ email: email.toLowerCase() })

        // Run a check to validate if the user with the email exist
        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: `User with the email: ${email} not found`
            })
        }

        // return a success response if user exists
        res.status(200).json({
            status: "Success",
            message: `User with the email: ${email} deleted successfully`,
        })

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: `Internal server error: ${error}`
        })
    }
}

