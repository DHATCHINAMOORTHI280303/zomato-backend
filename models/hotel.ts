import mongoose ,{Document}from "mongoose";

interface dish extends Document{
    Name : string,
    Price : Number,
    Rating : Number

}
const DishSchema = new mongoose.Schema<dish>({
    Name: { type: String, required: true },
    Price: { type: Number, required: true },
    Rating: { type: Number, required: true, min: 1, max: 5 }
})

interface Hotel extends Document {
    Name: string;
    Location: string;
    Cuisine: string[];
    Rating: Number;
    Dishes: dish[];
  }
const HotelSchema= new mongoose.Schema<Hotel>({
    Name: { type: String, required: true },
    Location: { type: String, required: true },
    Cuisine: { type: [String], required: true },
    Rating: { type: Number, required: true, min: 1, max: 5 },
    Dishes: [DishSchema], // Array of dish subdocuments

})

const Hotels = mongoose.model<Hotel>("hotels",HotelSchema);
export {Hotels};