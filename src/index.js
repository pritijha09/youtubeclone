import dotenv from "dotenv"
dotenv.config()
import connectdb from "./db/index.js";
import app from "./app.js"
const port = process.env.port || 4000;

connectdb()
.then(()=>{
     app.listen(`${port}`, () => {
        console.log(`Serve at http://localhost:${port}`)
      }); 
})
.catch((err) => {
    console.log("MONGO db connection failed ", err)
});















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
