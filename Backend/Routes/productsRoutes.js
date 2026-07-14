import express from "express"
import { getAllProducts, getProductsById, addProducts, updateProducts, deleteProducts } from "../Controllers/productController.js"
import customMiddleware from "../Middlewares/customMiddleware.js"

const Router = express.Router() // initializing the Router method

Router.route('/products')
.get(customMiddleware, getAllProducts) // the is an example of using a customMiddleware 
.post(addProducts)

Router.route('/products/id')
.get(getAllProducts)
.patch(updateProducts)
.delete(deleteProducts)

export default Router