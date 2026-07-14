import express from "express"
import dotenv from "dotenv"
import userRoutes from "./Routes/userRoute.js"
import productsRoutes from "./Routes/productsRoutes.js"
import morgan from "morgan"
import connect from "./Utils/db.js"
import cors from "cors"



//USING dotenv to get the value of port instead of writing it directly into our code

//Firstly configure our dotenv file
dotenv.config({
    path: "./.env"
})

const app = express() // initializing our express app

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
})) // setting up our cross origin resource sharing so our frontend and backend can interract using API calls.

app.use(express.json()) // This is used to retrieve or parse the request .body also called a middle ware
app.use(morgan('dev')) 

// let PORT =5000
// app.listen(PORT, ()=> {
//     console.log(`Server connect @ PORT: ${PORT}`)
// })



// --------------------------------------------------------------------------------
//NB: ROUTE = HTTP METHOD + URL
// HTTP METHODS = POST, GET, PUT/PATCH, DELETE
// app.get("/api/v1/", (req,res)=> {

//     // sending html response
//     // res.send("you got all data")

//     // sending json response
//     try {
//         res.status(200).json({
//             status: "Success",
//             message: "All products gotten sucessfully"
//         })
//     } catch(err){
//         res.status(500).json({
//             status: "Failed",
//             message: `Internal Server Error: ${err}`
//         })
//     }
// })
// -----------------------------------------------------------------------------------


// Create an API. that gets all products and gives response
// app.get("/api/v1/products", getAllProducts )


// //ADD products to the customized database
// app.post('/api/v1/products', addProducts )


// // Getting a product by id using request paramaters
// app.get('/api/v1/products/:id', getProductsById )

// // Updating a product using the PATCH METHOD
// app.patch('/api/v1/products/:id', updateProducts )

// // Deleting Products from the database
// app.delete('/api/v1/products/:id', deleteProducts )

app.use('/api/v1/user', userRoutes) // Mount the user routes
app.use('/api/v1', productsRoutes); // Mount the product routes

connect() // connecting our mongodb databse to our application
// secondly using process.env to get the value of our port from .env file
let PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server connected to PORT: ${PORT}`)
})




// SO I TESTED THIS AND CREATED A BRANCH AND ADDED CO WORKERS/SENT INVITES