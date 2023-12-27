import mongoose from "mongoose";
interface iowner{
    _id:string,
    Name:string,
    Email:string,
    Contact:string,
    Restaurants:string[],
  }
const ResOwnerSchema = new mongoose.Schema<iowner>({
    _id:{type:String,required:true},
    Name:{type:String,required:true},
    Email:{type:String,required:true},
    Contact:{type:String,required:true},
    Restaurants:{type:[String],required:true},
})

const ResOwner = mongoose.model("res_owner_details",ResOwnerSchema);
export{ResOwner};