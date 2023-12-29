import {Request,Response} from "express";
import {Hotels} from "../models/hotel";
import mongoose ,{Document} from "mongoose";
import{Dish} from "../models/dish";
import {Users} from "../models/user/user";
import {Review} from "../models/reviews"
import {ResOwner} from "../models/user/res_owner"
import {bucket,upload,app} from "../utils/fileupload";
import { ref, getDownloadURL } from "firebase/storage";
import { getStorage } from 'firebase/storage';

async function search(req: Request<{},{},{},{startsWithLetter?:string}>, res: Response){
    try {
        console.log("called");
        const startsWithLetter   = req.query.startsWithLetter
        console.log(startsWithLetter);
       
    if (!startsWithLetter) {
      // Handle the case where startsWithLetter is not provided
      return res.status(400).json({ error: "Missing startsWithLetter parameter" });
    }
    // if(startsWithLetter.length==1){
    //   const search : Document[] =  await Hotels.find({ Name: { $regex: `^${startsWithLetter}`, $options: 'i' } }).lean().exec();
    //   console.log(search);
    //   return res.status(200).json({ search });
      
    // }
    if(startsWithLetter.length >= 1){
      // const search : Document[] =  await Dish.find({ Name:  { $regex: new RegExp(`\\b${startsWithLetter}`, "i") } }).lean().exec();
      const search :Document[] = await Hotels.find({ Name:{ $regex: new RegExp(`\\b${startsWithLetter}`, "i") }}).lean().exec();
      // console.log(search1);
      // const temp = search.concat(search1);
      console.log(search);
      return res.status(200).json({ search });
    }

    } catch (error) {
      console.error("Error getting hotels:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async function filter (req: Request<{Location?:String,Sub_Location?:String},{},{},{Rating?:String,Cuisine?:String,cpp?:String,Pure_veg?:string,Dish?:string}>, res: Response) {
    try {
        const Rating = req.query?.Rating;
        const Cuisine = req.query?.Cuisine?.split(",");
        const cpp = req.query?.cpp?.split("-");
        const pure_veg = req.query?.Pure_veg;
        const Dish = req.query?.Dish
        console.log(Dish)
        const query: any = { };
        query['Address.Location'] = {$eq: req.params.Location };
        if(req.params?.Sub_Location){
          query['Address.Sub_Location'] = {$eq:req.params?.Sub_Location};
        }

        if (Rating) {
          query.Delievery_Rating = { $gte: Number(Rating) };
        }
    
        if (Cuisine) {
          query.Cuisine = { $in: Cuisine };
        }
    
        if (cpp) {
          query.Cost_Per_Person = { $gte: Number(cpp[0]),$lt :Number(cpp[1])};
        }
        if(pure_veg){
          query.Pure_veg = {$eq:"true"};
        }
        if (Dish) {
          query[`Dishes.Name`] = { $eq: Dish };
        }
        console.log(query)
        
        
        const hotels: Document[] = await Hotels.find(query).lean().exec();
        
    console.log(hotels);
        res.status(200).json({ hotels });
      } catch (error) {
        console.error("Error getting hotels:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
async function getHotel(req: Request<{Location?:String,Name?:String,Sub_Location?:String},{},{},{}>, res: Response){
 
        const Location = req.params?.Location;
        const Name = req.params?.Name;
        const Sub_Location = req.params?.Sub_Location;
        console.log(Location,Name,Sub_Location);    
        const query: any = { };
        query['Address.Location'] = {$eq: Location };
        query['Address.Sub_Location'] = {$eq:Sub_Location};
        query.Name={$eq:Name};
        console.log(query);
        const hotel :any= await Hotels.findOne(query); 
        hotel["Location"] = hotel.Address.Location;
        hotel["Sub_Location"] = hotel.Address.Sub_Location;
        const Working_days = Object.keys(hotel.Operational_Hrs)
        hotel["Working_days"] = `${Working_days[0].slice(0,3)} - ${Working_days[Working_days.length-1].slice(0,3)}`
        hotel["Opening"]= Object.values(hotel.Operational_Hrs)[0];
        const reviews = await Review.find({HotelId:hotel._id}).lean().exec();
        const reviewed_user = await Promise.all(
          reviews.map(async (review) => {
            return await Users.findOne({_id: review.UserId});
          })  
        );
        res.status(200).json({hotel,reviews,reviewed_user});
}
interface iowner{
  _id:string,
  Name:string,
  Email:string,
  ContactNo:string,
  Restaurants?:string[],
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
interface slots { 
  opensAt : string,
  closesAt : string,
}

interface ioperational_hrs{
  Monday:slots[];
  Tuesday:slots[];
  Wednesday : slots[];
  Thursday : slots[];
  Friday : slots[];
  Saturday : slots[];
  Sunday : slots[];
}

async function addHotels(req: Request<
  { step: Number, res_id: String }, {},
  {
    ResName: string,
    Address: iaddress,
    ContactNo: string,
    Owner: iowner,
    Type: string,
    Outlet: string[],
    Cuisines: string[],
    Operational_Hrs: ioperational_hrs
  }, {}>, res: Response) {
    console.log("called");
    console.log(req.params.step);
  try {
    if (req.params.step == 1) {
      const Address = req.body.Address

      const { ResName, ContactNo, Owner } = req.body;
      console.log(ResName,ContactNo,Address,Owner);
      var res_owner = await ResOwner.findOne({ _id: Owner._id });
      if (!res_owner) {
        res_owner = await ResOwner.create({
          _id:Owner._id,
          Name:Owner.Name,
          Email:Owner.Email,
          ContactNo:Owner.ContactNo
        });
      }
      if (req.params?.res_id) {
        var new_res = await Hotels.findOne({ _id: req.params.res_id });
        new_res.Name = ResName || new_res.Name;
        new_res.Address = Address || new_res.Address;
        new_res.ContactNo = ContactNo || new_res.ContactNo;
        new_res.Owner = res_owner?._id || new_res.Owner;
      }
      else {
        var new_res = await Hotels.create({
          Name: ResName,
          Address,
          ContactNo,
          Owner: res_owner?._id
        })

      }
      await ResOwner.findOneAndUpdate({ _id: res_owner._id }, { $push: { Restaurants: new_res._id } });
      return res.status(201).json({ msg: "created successfully" , id:new_res._id });

    }
    if (req.params.step == 2) {
      const res_id = req.params.res_id;
      const { Outlet, Type, Operational_Hrs, Cuisines } = req.body;
      var new_res = await Hotels.findOneAndUpdate({ _id: res_id }, { $set: { Outlet, Type, Operational_Hrs, Cuisines } });
      return res.status(201).json({ msg: "added successfully", new_res });

    }
    if (req.params.step == 3) {
      const res_id = req.params.res_id;
      var Images: any = {};
      upload.fields([{ name: "menu" }, { name: "food" }, { name: "res_image" }])
      const files: any = req.files;
      const key = Object.keys(files);
      for (let i = 0; i < key.length; i++) {
        if (files[key[i]]) {
          const folderPath = `restaurant/${key[i]}`
          var arr: string[] = [];
          for (const file of files[key[i]]) {
            const storage = getStorage(app);
            const blob = bucket.file(`${folderPath}/${file.originalname}-${Date.now()}`);
            const blobStream = blob.createWriteStream({
              metadata: {
                contentType: file.mimetype
              },
            });
            blobStream.on('finish', async () => {
              getDownloadURL(ref(storage, blob.name)).
                then(async (url) => {
                  arr.push(url);
                })
                .catch((error) => { return res.status(404).json({ error }) })

            })
            Images[key[i]] = arr;

          }
        }

      }
      var new_res = await Hotels.findOneAndUpdate({ _id: res_id }, { $set: { Images} });
      return res.status(201).json({msg:"image uploaded successfully"})

    }



    // res.status(201).json({ result });
  } catch (error) {
    console.error("Error adding hotels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export{search,filter,getHotel,addHotels};