//const mongoose = require('mongoose');
import mongoose from 'mongoose'
import {DB_NAME} from "../constants.js";
const connectdb = async() =>{
    try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`, { useUnifiedTopology: true , useNewUrlParser: true , writeConcern: { w: 'majority' }})
      console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch(error) {
        console.error("MONGODB connection error ", error);
        process.exit(1)
    }
}

export default connectdb;