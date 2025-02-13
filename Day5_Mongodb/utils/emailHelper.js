const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"gmail",
    host: "smtp.gmail.com",
 auth: {
    user: "tomer1580@gmail.com",
    pass: process.env.EMAIL_ACCOUNT_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(email,otp) {
  // send mail with defined transport object
  const info = {
    from: "Tomer_ABES_CAnteen", // sender address
    to: email, // list of receivers
    subject: "OTP verification email from ABES ", // Subject line
    html: `<b>Hello Your OTP is ${otp}</b>`, // html body
  };
try{
  const resp=await transporter.sendMail(info);

  console.log("Message sent: %s", resp.messageId);
  return true;
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
catch(err){
console.log(err.message);
return false;

}


}
module.exports={main};