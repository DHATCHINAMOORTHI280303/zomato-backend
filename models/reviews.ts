import mongoose, { Schema, Document } from "mongoose";

interface reply extends Document {
    UserId: String,
    Name:String,
    Feedback: String,
    Vote: Number,
    Reply:reply[],

}
interface review extends Document {
    UserId: string,
    Name:String,
    HotelId: string,
    Feedback: string,
    Post:String,
    Reply: reply[],
    Vote: Number

}
const replySchema = new mongoose.Schema<reply>({
    UserId: { type: String, required: true },
    Name: { type: String, required: true },
    Feedback: { type: String },
    Vote: { type: Number },
    Reply: { type: [new Schema<reply>()], default: [] }
  }, { timestamps: true });

  
const reviewSchema = new mongoose.Schema<review>(
    {
        UserId: { type: String, required: true },
        Name:{ type: String, required: true },
        HotelId: { type: String, required: true },
        Feedback: { type: String, required: true },
        Post:{type:String},
        Reply: { type: [replySchema] },
        Vote: { type: Number }
    },
    { timestamps: true }
)
const Review = mongoose.model("reviews",reviewSchema);

export{Review};