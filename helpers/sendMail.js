const nodeMailer = require('nodemailer');
module.exports.sendMail =(email, subject,html) =>{
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const mailOptions = {
    from: 'midxk3@gmail.com',
    to: email,
    subject: subject,
    html: html
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
   console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      // do something useful
    }
  });
}