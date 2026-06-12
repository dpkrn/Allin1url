const User = require("../model/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpVerification, sendWelcomeEmail, sendNewUserOnboardingEmail } = require("../lib/mail");
const Profile=require('../model/userProfile')
const Otp = require("../model/otpModel");
const { clientUrl, serverUrl } = require("../utils");
const connectDB = require("../lib/db");

const getAuthCookieOptions = () => {
  const options = {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
    httpOnly: true,
  };

  if (process.env.TIER !== "dev") {
    const domain = process.env.DOMAIN || "allin1url.in";
    options.domain = `.${domain}`;
  }

  return options;
};

const parseOAuthState = (stateParam) => {
  if (!stateParam) {
    return { usertype: "onboarded" };
  }

  let state = String(stateParam).replace(/ /g, "+");
  state = state.replace(/-/g, "+").replace(/_/g, "/");
  while (state.length % 4) {
    state += "=";
  }

  return JSON.parse(Buffer.from(state, "base64").toString("utf8"));
};

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

    const normalizedEmail = (email || "").toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, deletedAt: null }).lean();
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
      { email: normalizedEmail, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );
    res.cookie("token", token, getAuthCookieOptions());
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
      ...getAuthCookieOptions(),
      expires: new Date(0),
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
  const frontendBase = clientUrl(process.env.TIER);

  try {
    await connectDB();

    const { code, state } = req.query;

    if (!code) {
      return res.redirect(`${frontendBase}/?error=${encodeURIComponent("Authorization code missing")}`);
    }

    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY is not configured");
    }

    const redirectUri = `${serverUrl(process.env.TIER)}/auth/google`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.id_token) {
      console.error("Google token exchange failed:", tokens);
      const tokenError = tokens.error_description || tokens.error || "Failed to get ID token";
      return res.redirect(`${frontendBase}/?error=${encodeURIComponent(tokenError)}`);
    }

    const tokenParts = tokens.id_token.split(".");
    if (tokenParts.length < 2) {
      throw new Error("Invalid ID token format");
    }

    const payload = JSON.parse(
      Buffer.from(tokenParts[1], "base64").toString("utf8")
    );

    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.redirect(`${frontendBase}/?error=${encodeURIComponent("Invalid audience")}`);
    }

    const { username, usertype = "onboarded" } = parseOAuthState(state);
    const email = (payload.email || "").toLowerCase().trim();
    const picture = payload.picture;

    if (!email) {
      return res.redirect(`${frontendBase}/?error=${encodeURIComponent("Google account has no email")}`);
    }

    let user = await User.findOne({ email, deletedAt: null }).lean();

    if (!user && usertype === "onboarding") {
      if (!username || username.length < 5) {
        return res.redirect(`${frontendBase}/?error=${encodeURIComponent("Username is required for signup")}`);
      }

      const normalizedUsername = username.toLowerCase();
      const newUser = await User.create({
        email,
        username: normalizedUsername,
      });
      await Profile.create({ username: normalizedUsername, image: picture });
      user = await User.findById(newUser._id).lean();

      sendWelcomeEmail(email, normalizedUsername, normalizedUsername, "All in1 url");
      const adminEmail = process.env.ADMIN_EMAIL || "d.wizard.techno@gmail.com";
      sendNewUserOnboardingEmail(adminEmail, normalizedUsername, normalizedUsername, "All in1 url");
    }

    if (!user && usertype === "onboarded") {
      return res.redirect(`${frontendBase}/login?error=${encodeURIComponent("No account found for this Google email. Please sign up first.")}`);
    }

    if (!user) {
      return res.redirect(`${frontendBase}/?error=${encodeURIComponent("Authentication failed")}`);
    }

    const token = jwt.sign(
      { email, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, getAuthCookieOptions());
    return res.redirect(`${frontendBase}/home`);

  } catch (err) {
    console.error("Google auth error:", err);
    const message = err.message || "Google authentication failed";
    return res.redirect(`${frontendBase}/?error=${encodeURIComponent(message)}`);
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
