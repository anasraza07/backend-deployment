const Users = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

const { errorResponseHandler, successResponseHandler } = require("../utils/responseHandler");
const sendEmailOTP = require("../utils/importantFunctions");

const signupController = async (req, res) => {
  const { username, email, password, age } = req.body;
  // console.log(username, email, password)
  if (!username || !email || !password) {
    return errorResponseHandler(400, false, "All fields are required.", res)
  }

  if (password.length < 8) {
    return errorResponseHandler(400, false, "Password must be 8 characters long.", res)
  }

  if (age < 18) {
    return errorResponseHandler(400, false, "Age cannot be less than 18.", res)
  }

  let randomOtp = "";
  for (let i = 1; i <= 4; i++) {
    randomOtp += Math.floor(Math.random() * 9)
  }
  // console.log(randomOtp)

  try {
    bcrypt.hash(password, 12, async function (err, hash) {
      await Users.create({ username, email, password: hash, age, otp: randomOtp })

      const transporterMessage = await sendEmailOTP(email, randomOtp)
      return successResponseHandler(200, true, "Signup successful " + transporterMessage, [], res)
    });
  } catch (error) {
    // console.log(error)
    return errorResponseHandler(400, false, error.message, res)
  }
}

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({
      email: email
    })

    if (!user) return errorResponseHandler(404, false, "User not found", res)

    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign({ email: user.email, id: user._id },
          process.env.JWT_SECRET, {
          expiresIn: 1 * 60
        })

        successResponseHandler(200, true, "Login successful", { token: token }, res)
      } else {
        return errorResponseHandler(404, false, "Invalid credentials", res)
      }
    });

    // console.log(user)
  } catch (err) {
    errorResponseHandler(500, false, "Server error: " + err, res)
  }
}

module.exports = { signupController, loginController }