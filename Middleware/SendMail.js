const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
//==============================================================================// config
dotenv.config();

//===============================================================================//  mail function
const sendEMail = async (to, subject, data = {}) => {
 try {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      //==============================================================================//  email transporter
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: 'Login information!',
        // html template //==============================================================================//
        html: `
          <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
          <title>send email</title>
          <style>
              body{
                  background-color: #eee;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-family:Arial, Helvetica, sans-serif;
              }
              .main-wraper{
                  border-radius: 5px;
                  margin: 50px 0 0 0;
                  background-color: #fff;
                  padding: 20px;
                  width: 600px;
                  height:520px;
                  box-shadow: 0px 0px  5px #eee;
              }
              .wraper{
                  padding: 0 10px;
              }
              .tamplate img{
                  margin-top: 10px;
                  width: 100px;
                  height: auto;
              }
              .temp-body p{
                width:100%;
                margin:20px 0;
              }
              .temp-body a{
                  display: block;
                  text-align: center;
                  line-height: 50px;
                  width: 150px;
                  height: 50px;
                  background: orange;
                  border: none;
                  box-shadow: 0px 0px  5px #eee;
                  font-size: 16px;
                  color: white;
                  text-decoration: none;
              }
              .temp-footer .social-icon {
                  margin: 0 0 30px 0;
                  display:flex;
                  gap: 10px;
              }
              .temp-footer .social-icon a{
                
                  text-decoration: none;
              }
              .temp-footer .social-icon a img{
                  width: 30px;
                  height: 30px;
              }
          </style>
      </head>
      <body >
          <div class="main-wraper" >
              <div class="wraper" >
                  <div class="tamplate">
                      <img src="https://wordsphere.com/wp-content/uploads/2021/11/wordsphere-1024x111.png" alt="">
                      <hr>
                      <div class="temp-body">
                          <h5>Dear ${data.name}</h5>
                          <p>You can login with this email and password</p>
                          <p>Email: ${data.email}</p>
                          <p>Password: ${data.password}</p>
                          <p>You can login with this email and password</p>
                          <a href="https://wordsphere.vercel.app/">Login now</a>
                       
                      </div>
                      <div class="temp-footer">
                       
                          <div class="social-icon">
                              <a href="" class="btn btn-sm"> 
                                  <img src="https://ci5.googleusercontent.com/proxy/Hp1tHwpZJplBQHTr-WRQujyXVO54yAQdUwALRHoIu3TW_4YDZ6B6Ls74s-w-3MEDpMW9F5Bc8V4B2IT49EMXsm4X1qqiK8IjzmNO4S_OfAs-tByTjpOe2-uS3s3hY3HTf5w=s0-d-e1-ft#http://pubs.payoneer.com/EmailSender/Payoneer/img/Default/BlocksTemplate/fb.jpg" alt="" class="CToWUd" data-bit="iit">
                              </a>
                              <a href="">
                                  <img src="https://ci6.googleusercontent.com/proxy/IrEOgUYJAxNOXCfkCzRhp3Pr5plttxi_SK_vo7HZtMFa9MnD5KZqMxD0PxnsIjARnAifRp7OuUYYY20Bx98L__qgfC-G266Bqx7WcwKAYkekf1hLO0pZhaVmV4UfPbaFNGY=s0-d-e1-ft#http://pubs.payoneer.com/EmailSender/Payoneer/img/Default/BlocksTemplate/tw.jpg" alt="" class="CToWUd" data-bit="iit">
                              </a>
                             <a href="">
                              <img src="https://ci6.googleusercontent.com/proxy/KSBDtD0zHbN5XeL5qH34sW3-l80xoG-w0BBfwWJAKOpm5TzMSQdySc4IybYGoQHKjT_Wo3UDUSeCtTIWDxoIky3CVQs4NQ208Te17XQNfgN2coi-_NX4ppd5lt40uL9B-LE=s0-d-e1-ft#http://pubs.payoneer.com/EmailSender/Payoneer/img/Default/BlocksTemplate/li.jpg" alt="" class="CToWUd" data-bit="iit">
                             </a>
                             <a href="">
                              <img src="https://ci4.googleusercontent.com/proxy/cqBt0SYqEkz5P5RlEVBOgBiEsYGuAGdvEGnMKJY7Pny4E4Fc4Wh2XESh_BSxyR0kc6MwhSZ90frj3Z0X3li2uWsh2aqA78SPkhL0ypAuvU4H_SC5HzvlUoN3eE5687knUrE=s0-d-e1-ft#http://pubs.payoneer.com/EmailSender/Payoneer/img/Default/BlocksTemplate/yt.jpg" alt="" class="CToWUd" data-bit="iit">
                             </a>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
          
          `,
      });
 } catch (error) {
    console.log(error)
 }
};

//======================================================// exports
module.exports = sendEMail;