const nodemailer = require("nodemailer");
const {
  Verification_Email_Template,
  Notification_Email_Template,
  Welcome_Email_Template,
  Onboarding_Email_Template,
  Profile_Visit_Email_Template,
} = require("./emailTemplate");


const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "linkbriger@gmail.com",
    pass: process.env.EMAIL_PASS || "djppjsnipjufbqee",
  },
});


const sendVisitEmail = async (
  email,
  username,
  name,
  details,
  platform
) => {
  const placeholders = {
    "{{username}}": username,
    "{{name}}": name,
    "{{platform}}": platform,
    "{{city}}": details.city,
    "{{country}}": details.country,
    "{{browser}}": details.browser,
    "{{time}}": details.time,
    "{{ipAdd}}": details.ip,
  };

  let emailHTML = Notification_Email_Template;
  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(key, "g");
    emailHTML = emailHTML.replace(regex, value);
  }

  const emailUser = process.env.EMAIL_USER || "linkbriger@gmail.com";
  const data = {
    from: `"LinkBridger" <${emailUser}>`,
    to: email,
    subject: `New Visit on Your ${platform}`,
    text: `Hello ${name} (${username}), someone visited your ${platform} link.`,
    html: emailHTML,
  };

  try {
    const info = await transport.sendMail(data);
    if (info.accepted.length > 0) {
      console.log("✅ Email sent to:", email);
    } else {
      console.warn("⚠️ Email not accepted:", info);
    }
  } catch (err) {
    console.error(`error while sending email to ${email} : ${err.message}`);
  }
};


const sendOtpVerification = async (otp, email, username, AppName) => {
  const data = {
    from: `"${AppName}" <linkbriger@gmail.com>`,
    to: email,
    subject: "Your Message is",
    text: `Hello ${username}`,
    html: Verification_Email_Template.replace(
      "{verificationCode}",
      otp
    ).replace("{username}", username),
  };

  try {
    const info = await transport.sendMail(data);
    if (info) {
      console.log(`otp sent to ${email} : ${otp}!`);
    }
  } catch (err) {
    console.log(`error while sending otp to ${email} : ${err.message}`);
  }
};

const sendEmailVerification = async (
  verificationLink,
  email,
  username,
  AppName
) => {
  const emailUser = process.env.EMAIL_USER || "linkbriger@gmail.com";
  const data = {
    sender: `"${AppName}" <${emailUser}>`,
    reciever: email,
    subject: "Your Email Verification Link",
    text: "",
    html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        .email-container {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f7f7f7;
            padding: 20px;
            text-align: center;
        }
        .email-content {
            background-color: #ffffff;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
            display: inline-block;
            text-align: left;
            max-width: 600px;
            margin: 0 auto;
        }
        .email-content h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .verify-button {
            display: inline-block;
            padding: 12px 24px;
            margin-top: 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        .verify-button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-content">
            <h1>Email Verification</h1>
            <p>Hi <strong>${username}</strong>,</p>
            <p>Thank you for signing up at <strong>${AppName}</strong>! To complete your registration, please verify your email address by clicking the button below:</p>
            <a href=${verificationLink} class="verify-button">Verify Your Email</a>
            <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
            <p><a href=${verificationLink}>${verificationLink}</a></p>
            <p>If you did not create an account, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 ${AppName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>


        `,
  };

  try {
    const info = await transport.sendMail(data);
    if (info) {
      console.log(`email sent to ${email} !`);
    }
  } catch (err) {
    console.log(`error while sending email to ${email} : ${err.message}`);
  }
};

const sendWelcomeEmail = async (email, username, name, AppName) => {
  let html = Welcome_Email_Template.replace(/{username}/g, username);
  html = html.replace(/{name}/g, name || username);
  const emailUser = process.env.EMAIL_USER || "linkbriger@gmail.com";
  const supportEmail = process.env.SUPPORT_EMAIL || "support@linkbridger.com";
  
  // Replace support email in template
  html = html.replace(/support@linkbridger\.com/g, supportEmail);
  html = html.replace(/d\.wizard\.techno@gmail\.com/g, supportEmail);
  
  const data = {
    from: `"${AppName}" <${emailUser}>`,
    to: email,
    subject: "🎉 Welcome to LinkBridger - Your Link Management Journey Begins!",
    text: `Hello ${name || username} (@${username})! Welcome to LinkBridger. Your personalized link is ready: https://allin1url.in/${username}`,
    html: html,
  };

  try {
    const info = await transport.sendMail(data);
    if (info) {
      console.log(`email sent to ${email} !`);
    }
  } catch (err) {
    console.log(`error while sending email to ${email} : ${err.message}`);
  }
};

const sendNewUserOnboardingEmail = async (email, username, name, AppName) => {
  let html = Onboarding_Email_Template.replace(/{username}/g, username);
  html = html.replace(/{name}/g, name || username);
  const emailUser = process.env.EMAIL_USER || "linkbriger@gmail.com";
  
  const data = {
    from: `"${AppName}" <${emailUser}>`,
    to: email,
    subject: `🎉 New User Joined LinkBridger - @${username}`,
    text: `New user @${username} has joined the LinkBridger community. Profile link: https://allin1url.in/${username}`,
    html: html,
  };


  try {
    const info = await transport.sendMail(data);
    if (info) {
      console.log(`email sent to ${email} !`);
    }
  } catch (err) {
    console.log(`error while sending email to ${email} : ${err.message}`);
  }
};

const sendProfileVisitEmail = async (
  email,
  profileOwnerUsername,
  profileOwnerName,
  deviceDetails,
  visitorUsername = null,
  visitorName = null
) => {
  // Determine visitor information
  const visitorDisplayName = visitorName || visitorUsername || "Someone";
  const visitorUsernameDisplay = visitorUsername || "Anonymous";
  const visitorNameText = visitorUsername 
    ? `${visitorName || visitorUsername} (@${visitorUsername})` 
    : "Someone";

  const placeholders = {
    "{{username}}": profileOwnerUsername,
    "{{visitorName}}": visitorNameText,
    "{{visitorDisplayName}}": visitorDisplayName,
    "{{visitorUsername}}": visitorUsernameDisplay,
    "{{city}}": deviceDetails.city || "Unknown",
    "{{country}}": deviceDetails.country || "Unknown",
    "{{browser}}": deviceDetails.browser || "Unknown",
    "{{time}}": deviceDetails.time || new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
    "{{ipAdd}}": deviceDetails.ip || "Unknown",
  };

  let emailHTML = Profile_Visit_Email_Template;
  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(key.replace(/[{}]/g, "\\$&"), "g");
    emailHTML = emailHTML.replace(regex, value);
  }

  const emailUser = process.env.EMAIL_USER || "linkbriger@gmail.com";
  const subject = visitorUsername 
    ? `👋 ${visitorName || visitorUsername} (@${visitorUsername}) visited your profile!`
    : `👋 Someone visited your LinkBridger profile!`;

  const data = {
    from: `"LinkBridger" <${emailUser}>`,
    to: email,
    subject: subject,
    text: `Hello ${profileOwnerName} (@${profileOwnerUsername}), ${visitorNameText} has visited your LinkBridger profile!`,
    html: emailHTML,
  };

  try {
    const info = await transport.sendMail(data);
    if (info.accepted.length > 0) {
      console.log("✅ Profile visit email sent to:", email);
    } else {
      console.warn("⚠️ Profile visit email not accepted:", info);
    }
  } catch (err) {
    console.error(`error while sending profile visit email to ${email} : ${err.message}`);
  }
};

module.exports = {
  sendEmailVerification,
  sendOtpVerification,
  sendVisitEmail,
  sendWelcomeEmail,
  sendNewUserOnboardingEmail,
  sendProfileVisitEmail,
};
