import express, { NextFunction, Request, Response } from "express"
import randomstring from "randomstring";
import { Users } from "../models/user";
import {Token} from "../models/refresh"
import nodemailer from "nodemailer";
import passport, { use } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Twilio } from "twilio";
import { maxAgeAccess, maxAgeRefresh, createAccessToken, createRefreshToken } from "../utils/tokengenerator"
import jwt from "jsonwebtoken"
import { Session, SessionData } from 'express-session';

interface user{
  _id?:String,
  Name : String,
  Email : String,
  GoogleId?: String,
  ProfilePic?: String,
  MobileNo?:String,
  Handle?:String,
  Website?:String
}



passport.use(
  new GoogleStrategy({
    callbackURL: "http://localhost:3000/signup/google/redirect",
    clientID: "602927526483-729hetb1iu3ejamt0pgime5dutm3vpd2.apps.googleusercontent.com",
    clientSecret: "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"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
      // console.log("a&r:", accessToken, refreshToken);
      let user:user= await Users.findOne({ Email: profile.emails[0].value })
      if (!user){
        user = await Users.create({
          Name: profile.displayName,
          Email: profile.emails[0].value,
          GoogleId: profile.id,
          ProfilePic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
        })
        const access = createAccessToken(user._id);
        // const refresh = createRefreshToken(user._id);
        const token =await Token.create({
          _id:user._id,
          // refreshToken:refresh,
          accessToken:access,

        })
      }
      else {
        user = await Users.findOneAndUpdate({ Email: profile.emails[0].value }, { $set: { GoogleId: profile.id, ProfilePic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined } })
        const access = createAccessToken(user._id);
        // const refresh = createRefreshToken(user._id);
        await Token.updateOne({_id:user._id},{$set:{accessToken:access}})
       
      }
      return done(null,user._id)

    } catch (error) {
      return done(error)

    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dhatchinamoorthi.r@codingmart.com',
    pass: 'Ram2803@123456',
  },
});

const authRoutes = express.Router();

const otpstorage: Record<string, { otp: string; expiresAt: number }> = {};

const otpstorage2: Record<string, { otp: string; expiresAt: number }> = {};

authRoutes.post("/onload",async(req: Request<{}, {}, {Token?: string}, {}>, res: Response, next: NextFunction)=>{
  const Token = req.body?.Token;
  console.log(Token);
  if(Token){
    jwt.verify(Token,"rdm secret access",async(err,decoded:any)=>{
      if(err){
        console.log(err.message);
        if(err.message.includes("jwt expired")){
        return res.status(404).json({err:"token expired"});
        }
        if(err.message.includes("invalid token")){
          return res.status(404).json({err:"invalid token"});
          }
        
      }
      else{
        console.log("decoded:",decoded.id)
        const user = await Users.findOne({_id:decoded?.id})
        console.log(user);
        return res.status(200).json({user});
      }
    })

  }
  else{
    res.status(200).json({msg:"Token not exists"})

  }
})


authRoutes.post("/signup", async (req: Request<{}, {}, { Name: string, Email: string,MobileNo? :String }, {}>, res: Response, next: NextFunction) => {
  try {
    console.log(req.body.Email);
    const { Name, Email } = req.body;
    const MobileNo = req.body?.MobileNo;
    const user = await Users.findOne({ Email });
    console.log(Name, Email);
    if (user) {
      return res.status(409).json({ error: 'Email is already registered' });
    }
    if(MobileNo){
      await Users.create({
        Name,
        Email,
        MobileNo,
      })
      return res.status(201).json({msg:"user created with mobileno"})
    }
    const otp = randomstring.generate({ length: 6, charset: 'numeric' });
    const expiresAt = Date.now() + 10 * 60 * 1000; 
    otpstorage[Email] = { otp, expiresAt };
    console.log(otpstorage[Email]);
    const mailOptions = {
      from: 'dhatchinamoorthi.r@codingmart.com',
      to: Email,
      subject: 'Verification Code for Signup',
      text: `Your verification code is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent for verification' });

  } catch (error) {
    next(error)
  }
})


authRoutes.post('/signup/verify', async (req: Request<{}, {}, { Name: String, Email: string, otp: string }, {}>, res: Response, next: NextFunction) => {
  const { Name, Email, otp } = req.body;
  try {
    const storedOtp = otpstorage[Email];

    if (!storedOtp || storedOtp.expiresAt < Date.now()) {
      return res.status(401).json({ error: 'OTP expired or invalid' });
    }

    if (storedOtp.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }
   const user =  await Users.create({
      Name,
      Email
    })
    const access = createAccessToken(user._id);
    // const refresh = createRefreshToken(user._id)
    await Token.create({
      _id:user._id,
      // refreshToken:refresh,
      accessToken:access,
    })
    delete otpstorage[Email];
    res.status(200).json({ message: 'Signup successful',token:access,user });
  } catch (error) {
    next(error);
  }
});


authRoutes.get("/signup/google", passport.authenticate("google", {
  scope: ['profile', 'email']
}))


declare module 'express-session' {
  interface SessionData {
    user?: user;
    // Add other session properties as needed
  }
}
// interface ExtendedRequest extends Request {
//   session: Session & Partial<SessionData>;
// }
authRoutes.get("/signup/google/redirect",   passport.authenticate('google'), async(req, res) => {
  const user = await Users.findOne({_id:req.user}); 
  const access = await Token.findOne({_id:req.user});
  console.log(req.user,access)
  // res.status(200).json({user,token:access});
  // res.cookie("user",user)
  res.cookie("token",access.accessToken,{path:"/"})
  // localStorage.setItem('user', JSON.stringify(user));
  // req.session.user  =  {
  //   _id: user._id,
  //   Name: user.Name,
  //   Email:user.Email,
  //   // Add other user data as needed
  // }
  // res.redirect(`http://localhost:3000`);
  res.status(200).json({msg:"success"})
})
// const redirectUrl="/"
// authRoutes.get('/redirect', async(req, res) => {
//   const user = await Users.findOne({_id:req.user}); 
//   const access = await Token.findOne({_id:req.user});
//   res.redirect(`${redirectUrl}?user=${user}&Token=${access}`);
// });


// authRoutes.get('/', (req:ExtendedRequest, res, next) => {
//   passport.authenticate('google', (err:any, user:user,) => {
//     if (err) {
//       return next(err);
//     }

//     if (!user) {
//       return res.status(404).json({err:"user not created"});
//     }

//     // Store user data in session
//     if(user){

    
    // req.session.user  =  {
    //   _id: user._id,
    //   Name: user.Name,
    //   Email:user.Email,
    //   // Add other user data as needed
    // };
//   }

//     // Redirect to the desired route
//     return res.redirect('/sucess');
//   })
// });
authRoutes.get("/",(req,res)=>{
  res.status(200).json({msg:"welcome to home page"})
})

authRoutes.get("/logout",(req,res)=>{
  res.cookie("token","",{maxAge:1});
  res.cookie("connect.sid","",{maxAge:1});
  res.status(200).json({msg:"logout"})
})



authRoutes.post("/login", async (req: Request<{}, {}, { MobileNo?: string,Email?:string }, {}>, res: Response, next: NextFunction) => {
  try {
    if(req.body?.MobileNo){
      const MobileNo = req.body.MobileNo;
      console.log(MobileNo);
      const accountSid = "AC166dfae69dc474242e426e7c077c3a6a";
      const authToken = "da70c45ab025bb2246d19d7abf495d22";
      const twilio = new Twilio(accountSid, authToken);
      const otp = randomstring.generate({ length: 6, charset: 'numeric' });
      const expiresAt = Date.now() + 10 * 60 * 1000; // Set expiration time to 1 minutes
      otpstorage2[MobileNo] = { otp, expiresAt };
      
      const message = await twilio.messages.create({
        body: `Your OTP is: ${otp}`,
        from: "+12403396762",
        to: MobileNo,
      });
      console.log(otpstorage2[MobileNo])
      // console.log(message);
      res.status(200).json({ message: 'OTP sent for verification' });
  
    }
    else if(req.body?.Email){
      const Email = req.body.Email;
      const user = await Users.findOne({ Email });
      if (user) {
        return res.status(409).json({ error: 'Email is already registered' });
      }
      const otp = randomstring.generate({ length: 6, charset: 'numeric' });
      const expiresAt = Date.now() + 10 * 60 * 1000; 
      otpstorage[Email] = { otp, expiresAt };
      console.log(otpstorage[Email]);
      const mailOptions = {
        from: 'dhatchinamoorthi.r@codingmart.com',
        to: Email,
        subject: 'Verification Code for Signup',
        text: `Your verification code is: ${otp}`,
      };
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'OTP sent for verification' });
    
  }
 } catch (error) {
    next(error);
  }  
})


authRoutes.post("/login/verify", async (req: Request<{}, {}, { MobileNo?: string,Email?:string,otp: string }, {}>, res: Response, next: NextFunction) => {
  try {
    const otp = req.body.otp;
    if(req.body?.MobileNo){
      const MobileNo = req.body?.MobileNo;
      console.log("called")
      const storedOtp = otpstorage2[MobileNo];
      if (!storedOtp || storedOtp.expiresAt < Date.now()) {
        return res.status(401).json({ error: 'OTP expired or invalid' });
      }
      if (storedOtp.otp !== otp) {
        return res.status(401).json({ error: 'Invalid OTP' });
      }
      delete otpstorage2[MobileNo];
      const users = await Users.findOne({ MobileNo });
      if (!users) {
        return res.status(404).json({msg:"please sign up"});
      }
    }
    if(req.body?.Email){
      const Email = req.body.Email;
      const user = await Users.findOne({Email});
      if(!user){
        return res.status(401).json({msg:"This email is not registered with us. Please sign up."})
      }
      const storedOtp = otpstorage[Email];
  
      if (!storedOtp || storedOtp.expiresAt < Date.now()) {
        return res.status(401).json({ error: 'OTP expired or invalid' });
      }
  
      if (storedOtp.otp !== otp) {
        return res.status(401).json({ error: 'Invalid OTP' });
      }
      delete otpstorage[Email];
    }
    res.status(200).json({ message: 'login successful' });
    
  } catch (error) {
    next(error);
  }
})

authRoutes.post("/login/withoutEmail",async(req: Request<{}, {}, { MobileNo:String,Name:String}, {}>, res: Response, next: NextFunction)=>{
  const {Name,MobileNo}= req.body;
  try {
    await Users.create({
      Name,
      MobileNo
    })
    res.status(201).json({msg:"user created successfully"})
    
  } catch (error) {
    next(error);  }
})


authRoutes.get("/login/google", passport.authenticate("google", {
  scope: ['profile', 'email']
}))


authRoutes.get("/login/google/redirect", passport.authenticate("google"), (req, res) => {
  res.status(200).json({ "msg": "login success" });
})






export { authRoutes };