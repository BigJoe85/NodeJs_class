import mongoose from "mongoose";

const connect = async () => {

await mongoose.connect(process.env.MONGODB_URL).then((conn) => {
    console.log (`Mongodb connected sucessfully: ${conn.connection.host}`)
}).catch(err => {
    console.log(`Unable to connect to mongodb ${err}`)
})
}

export default connect
