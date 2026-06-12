const User = require("../model/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpVerification, sendWelcomeEmail, sendNewUserOnboardingEmail } = require("../lib/mail");
const Profile=require('../model/userProfile')
const Otp = require("../model/otpModel");
const { clientUrl } = require("../utils");

function generateOTP() {
  let otp = Math.floor(1000 + Math.random() * 9000);
  otp = JSON.stringify(otp);
  console.log(otp)
  return otp;
}
const signUpController = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !username ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (username.length < 5) {
      return res.status(400).json({
        success: false,
        message: "username should be atleast 5 character length !",
      });
    }

    
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(409)
        .json({ success: false, message: "user allready exists !" });
    }
    // const hashedPassword = await bcryptjs.hash(password, 10);
    

    const user = await User.create({
      email,
      // password: hashedPassword,
      username:username.toLowerCase(),
    });
    const userinfo=await Profile.create({username,image:"/images/panda.png"});
    if (user&&userinfo) {
      console.log("user created");
      // Use name from request body or fallback to username
      const displayName =  username;
      sendWelcomeEmail(email, username, displayName, "All in1 url");
      const adminEmail = process.env.ADMIN_EMAIL || "d.wizard.techno@gmail.com";
      sendNewUserOnboardingEmail(adminEmail, username, displayName, "All in1 url");
      return res
        .status(201)
        .json({ success: true, message: "user registerd !", user });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};

const signInController = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).lean();
    console.log("user",user)
    
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Email does not exist !" });
    const auth = await bcryptjs.compare(password, user.password);
    if (!auth) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials !" });
    }
    const token = jwt.sign(
      { email: email, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });
    delete user.password
    return res
      .status(200)
      .json({ success: true, message: "Login successfull", user });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};

const checkAvailablity = async (req, res) => {
  try {
    const { username } = req.body;
    console.log(username);

    const userExist = await User.findOne({ username });
    if (userExist) {
      return res
        .status(209)
        .json({ success: true, message: "username exists !" });
    }
    return res
      .status(200)
      .json({ success: true, message: "username not exists !" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error !" });
  }
};

const signOut = async (req, res) => {
  try {
    //  const token=jwt.sign({email:email,id:user._id},process.env.JWT_KEY,{expiresIn:'24h'})
    res.cookie("token", "", {
      expires: new Date(0),
      sameSite: "None",
      secure: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged Out successfull" });
  } catch (err) {


    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const id = req.userId;

    // Find user by ID and return a plain JavaScript object
    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    // Remove the password field from the user object
    delete user.password;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.username}!`,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const sendOtp = async (req, res, next) => {
  const { email } = req.body;
  let { username } = req.body || "";
  if (!username) username = " ";
  console.log("sending otp");
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const otp = generateOTP();

    const hashedOtp = await bcryptjs.hash(otp, 10);

    // Save the hashed OTP in the database
    sendOtpVerification(otp, email, username, "Link Bridge");
    const isAvailable = await Otp.findOne({ email });
    if (isAvailable) {
      const isOtp = await Otp.updateOne(
        { email },
        { $set: { otp: hashedOtp, createdAt: Date.now() } }
      );
      if (isOtp) {
        return res
          .status(201)
          .json({ success: true, message: `Otp has been sent to ${email}` });
      }
    } else {
      const isOtp = await Otp.create({ otp: hashedOtp, email });
      if (isOtp) {
        return res
          .status(201)
          .json({ success: true, message: `Otp has been sent to ${email}` });
      }
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};

const changePassword = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Fields Required" });

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Save the hashed OTP in the database

    const isChanged = await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );
    if (isChanged) {
      return res
        .status(201)
        .json({ success: true, message: `Password Reset Successfully` });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};

const handleAuthCallback=async (req, res) => {
  try {
    console.log("handleAuthCallback",req)
    const { code, state } = req.query;
    // console.log("code and status=",code,state)

    if (!code) {
      console.log("Authorization code missing")
      return res.redirect(`${clientUrl(process.env.TIER)}/?error=Authorization code missing`);
    }

    // 🔁 Exchange auth code for tokens (SERVER ONLY)
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.TIER=='dev'?"http://localhost:8080":"https://api.allin1url.in"}/auth/google`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.id_token) {
      console.log("Failed to get ID token")
      return res.redirect(`${clientUrl(process.env.TIER)}/?error=Failed to get ID token`);
    }

    // 🔐 Decode ID token (basic decode for now)
    const payload = JSON.parse(
      Buffer.from(tokens.id_token.split(".")[1], "base64").toString()
    );

    /**
     * payload contains:
     * sub, email, name, picture, email_verified, aud, iss, exp
     */

    // ✅ Verify audience
 
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      console.log("Invalid audience")
      return res.redirect(`${clientUrl(process.env.TIER)}/?error=Invalid audience`);
    }

    const {username,usertype}=JSON.parse(
      Buffer.from(state,'base64').toString()
    )
    
    const email=payload.email
    const picture=payload.picture
    const email_verified=payload.email_verified

    // console.log("user payload and username",payload,username)

    //check user already exist or have to create
    let user = await User.findOne({ email }).lean();
   
    
    if (!user && usertype=='onboarding'){
      const newUser = await User.create({
        email,
        // password: hashedPassword,
        username:username.toLowerCase(),
      });
      const newUserInfo=await Profile.create({username,image:picture});
      if (newUser&&newUserInfo) {
        console.log("user created");
        // Update user variable to reference the newly created user
        user = await User.findById(newUser._id).lean();
        // Use name from request body or fallback to username
        const displayName =  username;
        sendWelcomeEmail(email, username, displayName, "All in1 url");
        const adminEmail = process.env.ADMIN_EMAIL || "d.wizard.techno@gmail.com";
        sendNewUserOnboardingEmail(adminEmail, username, displayName, "All in1 url");
      }
    }
    
    if (!user && usertype=='onboarded') {
      // Redirect to login page with error message instead of returning JSON
      return res.redirect(`${clientUrl(process.env.TIER)}/?error=Email does not exist`);
    }
    
    if (!user) {
      console.log("Authentication failed")
      // Fallback: if user still doesn't exist for any reason, redirect with error
      return res.redirect(`${clientUrl(process.env.TIER)}/?error=Authentication failed`);
    }
    
    // console.log("id=",user._id)

    // 🧠 Create your app JWT
    const token = jwt.sign(
      { email:email, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );
    console.log("generated token:",token)
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    // 🔁 Redirect to frontend dashboard (authenticated users go to /home)
    const frontendUrl = `${clientUrl(process.env.TIER)}/home`;
    res.redirect(frontendUrl);

    // 🔵 Option 2 (testing only): return JSON
    // res.json({ tokens, user: payload });

  } catch (err) {
    console.error("Google auth error:", err);
    return res.redirect(`${clientUrl(process.env.TIER)}/?error=Google authentication failed`);
  }
}

module.exports = {
  signUpController,
  signInController,
  getUserInfo,
  signOut,
  checkAvailablity,
  sendOtp,
  changePassword,
  handleAuthCallback
};
