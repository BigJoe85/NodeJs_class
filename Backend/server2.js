import express from "express"
import fs from "fs"






const app = express()
app.use(express.json()) // This is used to retrieve or parse the request body



//CREATING RESTFUL API's
// Firstly import fs module at the top
// Secondly, create a variable that holds the fs module, call the readFileSync
let newUsers = fs.readFileSync('./newUsers.json', 'utf-8')
console.log(newUsers)

// Convert the array of objects into a javascript object
let usersArray = JSON.parse(newUsers)
console.log(usersArray)


//Getting all users
app.get("/api/v2/users", (req, res) => {
    try {
        res.status(200).json({
            status: "Success",
            message: "Got all users sucessfully",
            data: usersArray
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: `Could not get all users ${error}`
        })
    }
})

//Getting a user by ID
app.get("/api/v2/users/:id", (req, res) => {
    // create a variable that holds the products which have the same id with the id in the request parameter 
    let userToFind = usersArray.find(el => el.id === req.params.id)
    console.log(req.params.id)
    try {
        // check if user exists
        if (!userToFind) {
            return res.status(404).json({
                status: "Failed",
                message: `Could not get user with the id: ${req.params.id}`
            })
        }

        res.status(200).json({
            status: "Success",
            message: `User with the id: ${req.params.id} found`,
            data: userToFind
        })

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: `Internal server error : ${error}`
        })
    }
})



//Adding new users
//FIRSTLY generate a seperate id for the product that is to be pushed to the custom database
//Secondly create a new object that will be posted to the customized database
//push the new pbject created to the array of objects
//write the updated array of objects into the custom database and we are to use Asynchronous method of writing files as it is a non blocking code and we aren't allow to use Synchronous file system methods inside a call back function.

app.post("/api/v2/users", (req, res) => {
    let userId = String(usersArray.length + 1);

    let newUsers = Object.assign({ id: userId }, req.body)

    usersArray.push(newUsers)

    fs.writeFile('./newUsers.json', JSON.stringify(usersArray), (err) => {
        try {
            if (err) {
                return res.status(400).json({
                    status: "Failed",
                    message: `${err}`
                })
            }

            res.status(200).json({
                status: "Success",
                message: "User added sucessfully",
                data: usersArray
            })
        } catch (error) {
            res.status(500).json({
                status: "Failed",
                message: `Internal server error: ${error}`
            })

        }

    })

})

// Updating users
// find the user to update by id using findIndex which returns -1 if the condition is not met 
// Check if the products exists in the custom database and return an error if it does not exist
//Add what is to be updated from the gotten index ti tge request body (req.body)
// Write whats to be updated into the database asynchronously since we are inside a callBack function and display and rror with the err parameter and resoinse with try catch

app.patch("/api/v2/users/:id", (req, res) => {
    const userIndex = usersArray.findIndex((p) => p.id === req.params.id)
    try {
        if (userIndex === -1) {
            return res.status(404).json({
                status: "Failed",
                message: `User with the id: ${req.params.id} not found`
            })
        }
        Object.assign(usersArray[userIndex], req.body);
        fs.writeFile("./newUsers.json", JSON.stringify(usersArray), (err) => {
            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    message: "Error occured while updating products"
                })
            }

            res.status(200).json({
                status: "Success",
                message: "User updated sucessfully",
                data: usersArray[userIndex]
            })

        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: `Internal server error: ${error}`
        })

    }
})


//Deleting products
// find the product to delete by id using find index
// check if the product exists in the custom database and return and error if it dosen't
// if it exist, splice the database array to remove/delete the particular product

app.delete('/api/v2/users/:id', (req,res)=> {
     const userIndex = usersArray.findIndex((p) => p.id === req.params.id)
     try {
        if(userIndex === -1){
            return res.status(404).json({
                status: "Failed",
                message: `User with the id: ${req.params.id} not found`
            })
        }

        usersArray.splice(userIndex, 1)
        fs.writeFile("./newUsers.json", JSON.stringify(usersArray), (err) =>{
            if(err){
                return res.status(500).json({
                    status: "Failed",
                    message: "Error occured while deleting user"
                })
            }
         res.status(200).json({
            status: "Success",
            message: "User deleted sucessfully"
         })
        })
     } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: `Internal server error: ${error}`
        })
     }
})



let PORT = 9050
app.listen(PORT, () => {
    console.log(`Server connect @ PORT: ${PORT}`)
})