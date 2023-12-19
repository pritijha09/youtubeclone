//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
dotenv.config()
import connectdb from "./db/index.js";
import express from "express"
const app = express()
const port = process.env.port;

app.listen(`${port}`, () => {
    console.log(`Serve at http://localhost:${port}`)
  });
connectdb();















/*
import express from "express"
const app = express()


;( async ()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       app.on("error", (error) => {
        console.error("ERROR", error);
        throw error
       })

       app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
       })
    } catch(error){
        console.error("ERROR:", error)
        throw error
    }
})()
*/
