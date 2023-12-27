import mongoose ,{Schema,Document}from "mongoose";
interface variety extends Document {
  Name: string,
  Price: Number,
  Rating: Number,
  Images: String,
  Vote: Number,
}
interface dish extends Document{
    Name : string,
    Variety:variety[];
    Price : Number,
    Rating : Number,
    Images:String,
    Vote:Number,

}
interface Review {
    userId: string;
    comments: string;
    Rating: number;
  }
interface iaddress extends Document{
    Latitude:string,
    Longitude:string,
    Country:string,
    Sub_Location:string,
    Pincode:string,
    Location:string,
    State:string,
    
}
interface slots extends Document{ 
  opensAt : string,
  closesAt : string,
}

interface ioperational_hrs extends Document{
  Monday:slots[];
  Tuesday:slots[];
  Wednesday : slots[];
  Thursday : slots[];
  Friday : slots[];
  Saturday : slots[];
  Sunday : slots[];
}
interface iimage extends Document{
  Menu:string[],
  Food:string[],
  Res_Image:string[]
}

const slotSchema = new mongoose.Schema<slots>({
  opensAt:{type:String,required:true},
  closesAt:{type:String,required:true},
},{timestamps:true})

const Operational_Hours_Schema = new mongoose.Schema<ioperational_hrs>({
  Monday:{type:[slotSchema],required:true},
  Tuesday:{type:[slotSchema],required:true},
  Wednesday:{type:[slotSchema],required:true},
  Thursday:{type:[slotSchema],required:true},
  Friday:{type:[slotSchema],required:true},
  Saturday:{type:[slotSchema],required:true},
  Sunday:{type:[slotSchema],required:true},
},{timestamps:true})

const varietySchema = new mongoose.Schema<variety>({
  Name: { type: String, required: true },
  Price: { type: Number, required: true },
  Rating: { type: Number, required: true, min: 1, max: 5 },
  Images: { type: String, required: true },
  Vote: { type: String, required: true },
},{timestamps:true})

const dishSchema = new mongoose.Schema<dish>({
    Name: { type: String, required: true },
    Variety:{type:[varietySchema]},
   
},{timestamps:true})

const ReviewSchema = new mongoose.Schema<Review>({
    userId: { type: String, required: true },
    comments: { type: String, required: true },
    Rating: { type: Number, required: true },
  },{timestamps:true});

const AddressSchema = new mongoose.Schema<iaddress>({
     Latitude:{type:String,required:true},
     Longitude:{type:String,required:true},
     Country:{type:String,required:true},
     Location:{type:String,required:true},
     Sub_Location:{type:String,required:true}
  
},{timestamps:true})


  
interface Hotel extends Document {
    Name: string;
    Category:string;
    Pure_veg:string;
    Type:string;
    Address : iaddress;
    ContactNo:string;
    Approval_Status:string;
    Owner:string;
    // Images:string[];
    Images:iimage;
    Outlet:string[];
    Cuisines: string[];
    Delievery_Rating: Number;
    Dining_Rating:Number;
    Cost_Per_Person:Number;
    Review:Review[];
    // Opening:string;
    // Working_days:string;
    Operational_Hrs:ioperational_hrs;
    Dishes: dish[];
  }
const ImageSchema = new mongoose.Schema<iimage>({
  Menu:{type:[String],required:true},
  Food:{type:[String],required:true},
  Res_Image:{type:[String],required:true},
})
const HotelSchema = new mongoose.Schema<Hotel>(
  {
    Name: { type: String, required: true },
    Category: { type: String, required: true,default:"Hotel"},
    Pure_veg:{type:String},
    Type: { type: String},
    Address:{type:AddressSchema,required:true},
    ContactNo:{type:String,required:true},
    Approval_Status:{type:String,required:true,default:"inprogress"},
    Owner:{type:String,required:true},
    // Location: { type: String, required: true },
    // Sub_Location: { type: String, required: true },
    // Images: { type: [String], required: true },
    Images:{type:ImageSchema},
    Outlet : { type: [String]},
    Cuisines: { type: [String]},
    Delievery_Rating: { type: Number, min: 1, max: 5 },
    Dining_Rating: { type: Number,  min: 1, max: 5 },
    Cost_Per_Person: { type: Number},
    Review: { type: [ReviewSchema] },
    // Opening: { type: String, required: true },
    // Working_days: { type: String, required: true },
    Operational_Hrs:{type:Operational_Hours_Schema},
    Dishes: {type:[dishSchema]}
  },
  { timestamps: true }
)

const Hotels = mongoose.model<Hotel>("hotels",HotelSchema);
export {Hotels};