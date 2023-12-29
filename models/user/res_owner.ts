import mongoose from "mongoose";
interface iowner{
    _id:string,
    Name:string,
    Email:string,
    ContactNo:string,
    Restaurants:string[],
  }
const ResOwnerSchema = new mongoose.Schema<iowner>({
    _id:{type:String,required:true},
    Name:{type:String,required:true},
    Email:{type:String,required:true},
    ContactNo:{type:String,required:true},
    Restaurants:{type:[String]},
})

const ResOwner = mongoose.model("res_owner_details",ResOwnerSchema);
export{ResOwner};