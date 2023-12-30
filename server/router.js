const mongoose = require("mongoose");
const User = require("./models/user_schema");
const nodemailer = require("nodemailer");

(async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://vinayvidhehi:TCWxRz3FVPro6DKM@ams.uaepwlv.mongodb.net/"
      )
      .then(() => console.log("connection successfull"));
  } catch (error) {
    console.error("Connection error:", error.message);
  }
})();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vinayvidhehi@gmail.com",
    pass: "avgo zstp olwh kppr ",
  },
});
//chrg qkgp cbmi jxgf
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const usersWithOTP = [];

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: "vinayvidhehi@gmail.com",
    to: email,
    subject: "OTP verification for AMS",
    text: `Your one-time password for signing up for AMS is ${otp}. Please do not share this with anyone`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Unable to send OTP, try again later");
  }
};

const handleUserSignup = async (req, res) => {
  try {
    const {email, key } = req.body;

    if (!email) {
      throw new Error("email is required");
    }

    if (key) {
      // Handle OTP generation and email sending
      const generatedOTP = generateOTP();

      usersWithOTP.unshift({ email, OTP: generatedOTP });
      console.log("User with OTP initially:", usersWithOTP);

      await sendOTPEmail(email, generatedOTP);

      res
        .status(200)
        .send({ message: "OTP sent to your email successfully", key: 1 });
    } else {
      const { email, OTP, password, usn } = req.body;
      console.log(
        "details after otp is sent is ",
        email,
        OTP,
        password,
        usn
      );
      // Handle user registration and OTP validation
      if (!OTP) {
        throw new Error("OTP is required");
      }

      console.log("otp array is ", usersWithOTP);
      const index = usersWithOTP.findIndex(
        (user) => user.email === email
      );
      const foundUser = usersWithOTP[index];
      const otp = JSON.stringify(foundUser.OTP);
      //console.log("type of founduser otp is ", typeof(otp), "type of otp is ", typeof(OTP))
      if (!foundUser || otp !== OTP) {
        usersWithOTP.splice(index, 1);
        throw new Error("Entered OTP doesn't match. Try again later.");
      }

      const newUser = new User({ email, password, usn });
      await newUser.save();

      usersWithOTP.splice(index, 1);
      res.status(200).send({ message: "User saved successfully", key: 1 });
    }
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).send({ message: error.message, key: 0 });
  }
};

const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await User.findOne({ email});
    if (response.password === password) {
      res.send({ message: "user found", key: 1, response });
    } else {
      res.send({ message: "user not found", key: 0 });
    }
  } catch (error) {
    console.log(
      "error while searching for user, try again later",
      error.message
    );
  }
};

module.exports = {
  handleUserLogin,
  handleUserSignup,
};
