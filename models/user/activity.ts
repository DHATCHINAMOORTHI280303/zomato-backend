import mongoose ,{Document} from "mongoose";

interface iactivity extends Document{
    _id:String;
    Review:ireview[];
    Photos:String[];
    Network:inetwork[];    
    Recently_Viewed:String[];
    Bookmarks:String[];
    Blog_Posts:iblog[];
}
interface inetwork extends Document{
    Followers:String[];
    Following:String[];
}
interface ireview extends Document{
    HotelId:String,
    Feedback:String,
    Rating:Number,
    Comments:icomments[];

}

interface icomments extends Document{
    UserId:String,
    Comments:String
}

interface iblog extends Document{
    Image:String[];
    Content:String;
}


const commentSchema = new mongoose.Schema<icomments>({
    UserId : {type :String},
    Comments : {type :String},
})

const reviewSchema = new mongoose.Schema<ireview>({
    HotelId: { type: String,},
    Feedback: { type: String},
    Rating: { type: Number },
    Comments:{type:[commentSchema]}
});

const blogSchema = new mongoose.Schema<iblog>({
    Image:{type:[String]},
    Content:{type:String},
})

const networkSchema = new mongoose.Schema<inetwork>({
    Followers:{type:[String]},
    Following:{type:[String]},
})

const activitySchema = new mongoose.Schema<iactivity>({
    _id: { type: String, required: true },
    Review: { type: [reviewSchema] },
    Photos: { type: [String] },
    Network:{type:[networkSchema]},
    Recently_Viewed: { type: [String] },
    Bookmarks: { type: [String] },
    Blog_Posts: { type: [blogSchema] },

}, { timestamps: true })

const Activity = mongoose.model("activity-user",activitySchema);
export{Activity};