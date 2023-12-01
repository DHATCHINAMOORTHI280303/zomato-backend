import mongoose from "mongoose";
import { type } from "os";
async function dbconnect():Promise<void>{
    try {
        await mongoose.connect("mongodb+srv://dhatchinamoorthir:zomato%40123456@zomato.hcaykbc.mongodb.net/zomato")
        .then(()=>{
            console.log("db connected")
        })
        
    } catch (error) {
        console.log(error);
    } 

}
const db :mongoose.Connection = mongoose.connection;
export {dbconnect,db}