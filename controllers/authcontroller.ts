import {Request,Response,NextFunction} from "express"
import {Users} from "../models/user/user";
import {Activity} from "../models/user/activity";
import { Token } from "../models/user/refresh";
import randomstring from "randomstring";
import { maxAgeAccess, maxAgeRefresh, createAccessToken, createRefreshToken } from "../utils/tokengenerator"
import {transporter,mailOptions} from "../utils/nodemailer";
import { Twilio } from "twilio";
import jwt from "jsonwebtoken";
import { Network } from "../models/user/network";
import {generateOTP,verifyOTP,otpstorage2} from "../utils/otp";
import {createMessage} from "../utils/twilio";
// import redis, { RedisClientType} from 'redis';
// import {promisify} from "util"
// const redisClient :RedisClientType= redis.createClient();
// const setotp = promisify(redisClient.set).bind(redisClient);
// const getotp = promisify(redisClient.get).bind(redisClient);

// const otpstorage: Record<string, { otp: string; expiresAt: number }> = {};

// const otpstorage2: Record<string, { otp: string; expiresAt: number }> = {};
var OTP = otpstorage2;

async function onload(req: Request<{}, {}, { Token?: string }, {}>, res: Response, next: NextFunction){
    const Token = req.body?.Token;
    console.log(Token);
    if (Token) {
      jwt.verify(Token, "rdm secret access", async (err, decoded: any) => {
        if (err) {
          console.log(err.message);
          if (err.message.includes("jwt expired")) {
            return res.status(404).json({ err: "token expired" });
          }
          if (err.message.includes("invalid token")) {
            return res.status(404).json({ err: "invalid token" });
          }
  
        }
        else {
          console.log("decoded:", decoded.id)
          const user = await Users.findOne({ _id: decoded?.id })
          console.log(user);
          return res.status(200).json({ user });
        }
      })
  
    }
    else {
      res.status(200).json({ msg: "Token not exists" })
  
    }
  }

async function signup(req: Request<{}, {}, { Name: string, Email: string, MobileNo?: String }, {}>, res: Response, next: NextFunction){
    try {
        console.log(req.body.Email);
        const { Name, Email } = req.body;
        const MobileNo = req.body?.MobileNo;
        const user = await Users.findOne({ Email });
        console.log(Name, Email);
        if (user) {
          return res.status(409).json({ error: 'Email is already registered' });
        }
        // if (MobileNo) {
        //   const user = await Users.create({
        //     Name,
        //     Email,
        //     MobileNo,
        //   })
        //   // await Activity.create({
        //   //   _id:user._id
        //   // })
        //   // await Network.create({
        //   //   _id:user._id
        //   // })
        //   const access = createAccessToken(user._id);
        //   // const refresh = createRefreshToken(user._id)
        //   await Token.create({
        //     _id: user._id,
        //     // refreshToken:refresh,
        //     accessToken: access,
        //   })
        //   res.cookie("token1", access, {path : "/"});
        //   return res.status(200).json({ message: 'signup successful using mobile no', token: access, user });
        // }
        // const otp = randomstring.generate({ length: 6, charset: 'numeric' });
        OTP = generateOTP(4,10*60*1000,Email);
        // const expiresAt = Date.now() + 10 * 60 * 1000;
        // otpstorage[Email] = { otp, expiresAt };
        // console.log(otpstorage[Email]);
        console.log(OTP);
        // const key = Email
        // await setotp(key,expiresAt,otp);
        // const mailOptions = {
        //   from: 'dhatchinamoorthi.r@codingmart.com',
        //   to: Email,
        //   subject: 'Verification Code for Signup',
        //   text: `Your verification code is: ${otp}`,
        // };
        const mailoptions = mailOptions(Email,OTP[Email].otp);
        await transporter.sendMail(mailoptions);
    
        res.status(200).json({ message: 'OTP sent for verification' });
    
      } catch (error) {
        next(error)
      }

}
async function signupverify (req: Request<{}, {}, { Name: String, Email: string, otp: string }, {}>, res: Response, next: NextFunction){
    const { Name, Email, otp } = req.body;
  try {
    // const storedOtp = otpstorage[Email];
    const storedOtp = OTP[Email];
    // const key = Email
    // const storedOtp = await getotp(key);
   
      const result = await verifyOTP(storedOtp, otp);
      delete OTP[Email];
      // res.status(200).json(result);
      const user = await Users.create({
        Name,
        Email
      })
      await Activity.create({
          _id:user._id
        })
        await Network.create({
          _id:user._id
        })
      const access = createAccessToken(user._id);
      // const refresh = createRefreshToken(user._id)
      await Token.create({
        _id: user._id,
        // refreshToken:refresh,
        accessToken: access,
      })
      // delete otpstorage[Email];
      res.cookie("token1", access, {path : "/"});
      res.status(200).json({ message: 'Signup successful', token: access, user });
    // if (!storedOtp || storedOtp.expiresAt < Date.now()) {
    //   return res.status(401).json({ error: 'OTP expired or invalid' });
    // }

    // if (storedOtp.otp !== otp) {
    //   return res.status(401).json({ error: 'Invalid OTP' });
    // }
  } catch (error) {
    res.status(401).json({ error: error.message });
}

}

async function login(req: Request<{}, {}, { MobileNo?: string, Email?: string }, {}>, res: Response, next: NextFunction){
    try {
        if (req.body?.MobileNo) {
          const MobileNo = req.body.MobileNo;
          console.log(MobileNo);
          // const accountSid = "AC166dfae69dc474242e426e7c077c3a6a";
          // const authToken = "48acc7a6724b0a462ef6705266953003";
          // const twilio = new Twilio(accountSid, authToken);
          // const otp = randomstring.generate({ length: 6, charset: 'numeric' });
          // const expiresAt = Date.now() + 10 * 60 * 1000; // Set expiration time to 1 minutes
          // otpstorage2[MobileNo] = { otp, expiresAt };
          OTP = generateOTP(6,60*10*1000,MobileNo);
          const otp = OTP[MobileNo].otp
          const message = createMessage(otp,MobileNo);
          
    
          // const message = await twilio.messages.create({
          //   body: `Your OTP is: ${otp}`,
          //   from: "+12403396762",
          //   to: MobileNo,
          // });
          console.log(OTP[MobileNo])
          // console.log(message);
          res.status(200).json({ message: 'OTP sent for verification' });
    
        }
        else if (req.body?.Email) {
          const Email = req.body.Email;
          const user = await Users.findOne({ Email });
          if (!user) {
            return res.status(409).json({ error: 'This email is not registered with us. Please sign up' });
          }
          // const otp = randomstring.generate({ length: 6, charset: 'numeric' });
          // const expiresAt = Date.now() + 10 * 60 * 1000;
          // otpstorage[Email] = { otp, expiresAt };
          // console.log(otpstorage[Email]);
          // const mailOptions = {
          //   from: 'dhatchinamoorthi.r@codingmart.com',
          //   to: Email,
          //   subject: 'Verification Code for Signup',
          //   text: `Your verification code is: ${otp}`,
          // };
          OTP = generateOTP(6,60*10*1000,Email);
          const mailoptions = mailOptions(Email,OTP[Email].otp);
          await transporter.sendMail(mailoptions);
    
          res.status(200).json({ message: 'OTP sent for verification' });
    
        }
      } catch (error) {
        next(error);
      }
}
async function loginverify(req: Request<{}, {}, { MobileNo?: string, Email?: string, otp: string }, {}>, res: Response, next: NextFunction){
    try {
        const otp = req.body.otp;
        var user;
        if (req.body?.MobileNo) {
          const MobileNo = req.body?.MobileNo;
          console.log("called")
          // const storedOtp = otpstorage2[MobileNo];
          const storedOtp = OTP[MobileNo];
          const result = await verifyOTP(storedOtp,otp);
          delete OTP[MobileNo];
          // if (!storedOtp || storedOtp.expiresAt < Date.now()) {
          //   return res.status(401).json({ error: 'OTP expired or invalid' });
          // }
          // if (storedOtp.otp !== otp) {
          //   return res.status(401).json({ error: 'Invalid OTP' });
          // }
          // delete otpstorage2[MobileNo];
          user = await Users.findOne({ MobileNo });
    
          if (!user) {
            return res.status(404).json({ msg: "please sign up" });
          }
        }
        if (req.body?.Email) {
          const Email = req.body.Email;
          user = await Users.findOne({ Email });
          // const storedOtp = otpstorage[Email];
          const storedOtp = OTP[Email];
          const result = await verifyOTP(storedOtp,otp);
          delete OTP[Email];
    
          // if (!storedOtp || storedOtp.expiresAt < Date.now()) {
          //   return res.status(401).json({ error: 'OTP expired or invalid' });
          // }
    
          // if (storedOtp.otp !== otp) {
          //   return res.status(401).json({ error: 'Invalid OTP' });
          // }
          // delete otpstorage[Email];
        }
        const access = await Token.findOne({ _id: user._id });
        res.cookie("token1", access.accessToken, {path : "/"});
        res.status(200).json({ message: 'login successful', user, token: access.accessToken });
    
      } catch (error) {
        next(error);
      }
}

async function loginwithoutemail(req: Request<{}, {}, { MobileNo: String, Name: String }, {}>, res: Response, next: NextFunction){
    const { Name, MobileNo } = req.body;
    try {
      const user = await Users.create({
        Name,
        MobileNo
      })
      await Activity.create({
        _id:user._id
      })
      await Network.create({
        _id:user._id
      })
      const access = createAccessToken(user._id);
      const token = await Token.create({
        _id: user._id,
        // refreshToken:refresh,
        accessToken: access,
      })
      res.cookie("token1", token.accessToken, {path : "/"});
      res.status(201).json({ msg: "user created successfully",user,token });
  
    } catch (error) {
      next(error);
    }
  }
  async function googleredirect(req:Request, res:Response){
    var user = await Users.findOne({ _id: req.user });
    var token = await Token.findOne({ _id: req.user });
    console.log(user);
    res.cookie("token1", token.accessToken, {path : "/"});
    res.redirect(`http://localhost:3000/`);
    // res.status(200).json({msg:"success"})
  }



function logout(req:Request, res:Response){
    res.cookie("token1", "", { maxAge: 1 });
    res.cookie("connect.sid", "", { maxAge: 1 });
    res.status(200).json({ msg: "logout" })
}



export{signup,signupverify,login,loginverify,logout,loginwithoutemail,googleredirect,onload};