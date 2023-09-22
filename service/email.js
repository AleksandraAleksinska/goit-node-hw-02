const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (userEmail, verificationToken) => {
    const emailOptions = {
        from: process.env.SENGRID_EMAIL,
        to: userEmail,
        subject: 'Please verify your email',
        text: 'In order to verify your email, please click following link:', 
        html: `http://localhost:3000/api/users/verify/${verificationToken}`,
      };
      try {
        await sgMail.send(emailOptions);
        console.log('Email successfully sent')
      }
      catch (error) {
        console.log(error)
      }
}

module.exports = { sendVerificationEmail }