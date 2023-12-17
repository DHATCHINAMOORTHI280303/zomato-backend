import mongoose ,{Document} from "mongoose";

interface iactivity extends Document{
    _id:String;
    Review:ireview[];
    Photos:String[];
    Followers:String[];
    Following:String[];
    Recently_Viewed:String[];
    Bookmarks:String[];
    Blog_Posts:iblog[];
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

const activitySchema = new mongoose.Schema<iactivity>({
    _id: { type: String, required: true },
    Review: { type: [reviewSchema] },
    Photos: { type: [String] },
    Followers: { type: [String] },
    Following: { type: [String] },
    Recently_Viewed: { type: [String] },
    Bookmarks: { type: [String] },
    Blog_Posts: { type: [blogSchema] },

}, { timestamps: true })

const Activity = mongoose.model("activity-user",activitySchema);
export{Activity};