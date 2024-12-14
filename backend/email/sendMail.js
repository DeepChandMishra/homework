const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendMail = async (email,mailSubject,mailBody) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const info = {
      from: process.env.EMAIL,
      to: email,
      subject: mailSubject,
      html: mailBody
    };

    transporter.sendMail(info,(error,result)=>{
      if(error){
        console.log(error);
      }else{
        console.log('mail sent sucessfully',result.response);
        
      }
    })
  } catch (error) {
    console.log(error.message);
  }
};
