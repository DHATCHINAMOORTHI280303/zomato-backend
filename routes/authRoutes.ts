import express, { NextFunction, Request, Response } from "express"
import randomstring from "randomstring";
import { Users } from "../models/user";
import nodemailer from "nodemailer";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Twilio } from "twilio";
import { maxAgeAccess, maxAgeRefresh, createAccessToken, createRefreshToken } from "../utils/tokengenerator"
passport.use(
  new GoogleStrategy({
    callbackURL: "http://localhost:3000/signup/google/redirect",
    clientID: "602927526483-729hetb1iu3ejamt0pgime5dutm3vpd2.apps.googleusercontent.com",
    clientSecret: "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"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
      console.log("a&r:", accessToken, refreshToken);
      let user = await Users.findOne({ Email: profile.emails[0].value })
      if (!user)
        user = await Users.create({
          Name: profile.displayName,
          Email: profile.emails[0].value,
          GoogleId: profile.id,
          ProfilePic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
        })


      else {
        user = await Users.findOneAndUpdate({ Email: profile.emails[0].value }, { $set: { GoogleId: profile.id, ProfilePic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined } })
      }
      return done(null, user)

    } catch (error) {
      return done(error)

    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
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


authRoutes.post("/signup", async (req: Request<{}, {}, { Name: string, Email: string }, {}>, res: Response, next: NextFunction) => {
  try {
    console.log(req.body.Email);
    const { Name, Email } = req.body;
    const user = await Users.findOne({ Email });
    console.log(Name, Email);
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
      return res.status(200).json({ error: 'Invalid OTP' });
    }
    await Users.create({
      Name,
      Email
    })
    delete otpstorage[Email];
    res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    next(error);
  }
});


authRoutes.get("/signup/google", passport.authenticate("google", {
  scope: ['profile', 'email']
}))


authRoutes.get("/signup/google/redirect", passport.authenticate("google"), (req, res) => {
  res.status(200).json({ "msg": "signup success" });
})


authRoutes.post("/login", async (req: Request<{}, {}, { MobileNo?: string,Email?:string }, {}>, res: Response, next: NextFunction) => {
  try {
    if(req.body?.MobileNo){
      const MobileNo = req.body.MobileNo;
      const accountSid = "AC166dfae69dc474242e426e7c077c3a6a";
      const authToken = "d289d02f7ad7fb1201c6bac950ad535e";
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