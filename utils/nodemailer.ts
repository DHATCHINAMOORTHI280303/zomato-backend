import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dhatchinamoorthi.r@codingmart.com',
      pass: 'Ram2803@123456',
    },
  });
  function mailOptions(Email:string,otp:string){
    return {
      from: 'dhatchinamoorthi.r@codingmart.com',
      to: Email,
      subject: 'Verification Code for Signup',
      text: `Your verification code is: ${otp}`,
    }

  }


export{transporter,mailOptions};