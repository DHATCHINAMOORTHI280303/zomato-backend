import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dhatchinamoorthi.r@codingmart.com',
      pass: 'Ram2803@123456',
    },
  });

export{transporter};