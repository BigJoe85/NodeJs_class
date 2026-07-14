import fs from "fs"

//CREATING RESTFUL API's
// Firstly import fs module at the top
// Secondly, create a variable that holds the fs module, call the readFileSync
let products = fs.readFileSync("./products.json", "utf-8")
// console.log(products)
// Convert the array of objects into a javascript object
let productsArray = JSON.parse(products)
// console.log(productsArray)


//Get all products we covered only controllers and routes, so lets work on those
export const getAllProducts = (req, res) => {
    try {
        res.status(200).json({
            status: "Success",
            message: "All products received",
            data: productsArray
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: `Could not get products ${error}`
        })
    }
}

//Get all products by ID
 export const getProductsById = (req, res) => {
     // create a variable that holds the products which have the same id with the id in the request parameter 
     console.log(req.params.id)
     let productToFind = productsArray.find(el => el.id === req.params.id)
     // checking if products exists
     try {
         if (!productToFind) {
             return res.status(404).json({
                 status: "Failed",
                 message: `Product with the id of ${req.params.id} not found`
             })
         }
         // return a success response if product exists
         res.status(200).json({
             status: "Success",
             message: `Product with the id: ${req.params.id} found`,
             data: productToFind
         })
 
     } catch (error) {
         res.status(500).json({
             status: "Failed",
             message: `Internal server error: ${error}`
         })
     }
 }

// Add Products
 export const addProducts =  (req, res) => {
     //FIRSTLY generate a seperate id for the product that is to be pushed to the custom database
     let id = String(productsArray.length + 1) // here we are generating a unique id for a each product that gets added
 
     //Secondly create a new object that will be posted to the customized database
     let newProducts = Object.assign({ id: id }, req.body); // Object.assign is an object method used to merge two objects together 
 
     //push the new pbject created to the array of objects
     productsArray.push(newProducts) // pushing the new object into the existing array of objects (productsArray)
 
     //write the updated array of objects into the custom database and we are to use Asynchronous method of writing files as it is a non blocking code and we aren't allow to use Synchronous file system methods inside a call back function.
 
     fs.writeFile("./products.json", JSON.stringify(productsArray), (err) => {
         try {
             res.status(201).json({
                 status: "Sucessfull",
                 message: "Products added sucessfully",
                 data: newProducts
             })
 
         } catch (error) {
             res.status(400).json({
                 status: "Failed",
                 message: `Failed to add products ${error}`
             })
         }
     })
 
     // using the err parameter
     // fs.writeFile("./products.json", JSON.stringify(productsArray), (err) => {
     //     if (err) {
     //         return res.status(400).json({
     //             status: "Failed",
     //             message: `Failed to add products: ${err}`
     //         });
     //     }
 
     //     res.status(201).json({
     //         status: "Sucessfull",
     //         message: "Products added sucessfully",
     //         data: newProducts
     //     });
     // });
 }

 // Update Products using the patch https model
export const updateProducts = (req, res) => {
    try {
        // find the product to update by id
        //findIndex always returns -1 if the condition is not met
        const productIndex = productsArray.findIndex((p) => p.id === req.params.id)
        // check if product with index exist in the custom database and return an error if it does not
        if (productIndex === -1) {
            return res.status(404).json({
                status: "Failed",
                message: "Product not found"
            });
        }

        // Add what is to be updated from the gotten index to the request body
        Object.assign(productsArray[productIndex], req.body);
        // Write whats been updated into the databass Asynchronously since we're in a callback function
        fs.writeFile("./products.json", JSON.stringify(productsArray), (err) => {
            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    message: "Error occured while updating products"
                });
            }

            // return a success response if product updates sucessfully
            res.status(201).json({
                status: "Success",
                message: `Product updated sucessfully`,
                data: productsArray[productIndex]
            });
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: `Internal server error: ${error}`,
        })
    }
}

// Deleting products
export const deleteProducts = (req, res) => {
    try {
        // find the product to delete by id  
        //findIndex always returns -1 if the condition is not met
        const productIndex = productsArray.findIndex((p) => p.id === req.params.id)
        // check if product with index exist in the custom database and return an error if it does not
        if (productIndex === -1) {
            return res.status(404).json({
                status: "Failed",
                message: "Product not found"
            });
        }
        //Splicing to remove/delete the particular product
        productsArray.splice(productIndex, 1)
        // Write/updating our database Asynchronously to be uptodate after deleting from our database
        fs.writeFile('./products.json', JSON.stringify(productsArray), (err) => {
            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    message: "Error occured while deleting products"
                });
            }
            // return a success response if product was deleted sucessfully
            res.status(200).json({
                status: "Success",
                message: `Product deleted sucessfully`,
            });
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: `Internal server error: ${error}`,
        })
    }
}


