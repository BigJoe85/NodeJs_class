// Firstly import mongoose
import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"

//Create a variable that holda the schema

let userSchema = new mongoose.Schema({
    //Remember whenever we add new before the method, it converts the method to an object
    image: {
        type: String,
        default: "bfsbfdfjdhkjfjdkfhdjhfjdbgnmdngfmndjgf" //used if no image is provided by the user
    },
    userName: {
        type: String,
        required: [true, "UserName is required"] // this says make this input field requred and displays the message if not filled
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true, // This removes extra space before and after the email
        unique: true, // This says no other user should have this email
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Please provide a valid email"
        }
    },

    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },

    password: {
        type: String,
        minLength: 6,
        // maxLength: 15
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value, {
                    minLength: 6,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })
            },
            message: "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String
    }

},
    { timestamps: true }
);


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return; // do not encrypt if the password has not been modified

    if (this.password.startsWith("$2")) return; // do not encrypt if the password starts with "$2"

    // encrypt password
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Create a model from the schema
// It is convention to use capital letters for the variable name of the model
export const User = mongoose.model("User", userSchema)