const Users = require("../models/userModel")
const jwt = require("jsonwebtoken")
const { successResponseHandler, errorResponseHandler } = require("../utils/responseHandler")

const getUsersController = async (req, res) => {
  try {
    let query = {}
    if (req.query.ageStart && req.query.ageEnd) {
      const queryFlag = { ...req.query }

      delete queryFlag.ageStart
      delete queryFlag.ageEnd

      query = {
        ...queryFlag,
        age: { $gte: req.query.ageStart, $lte: req.query.ageEnd }
      }
    }

    console.log(req.query)

    let sortBy = req.query.sort || "_id";
    let limit = req.query.limit || 0;
    let page = req.query.currentPage
    let search = req.query.search || ""

    if (search) {
      query.username = search
    }

    try {
      const totalUsers = await Users.countDocuments(query);
      const users = await Users.find(query).sort(sortBy).limit(limit).skip((page - 1) * limit);
      successResponseHandler(200, true, "All users fetched", { users, totalUsers }, res)
    } catch (error) {
      errorResponseHandler(400, false, error.message, res)
    }
  } catch (err) {
    console.log(err)
    errorResponseHandler(500, false, err, res)
  }
}

const updateUserController = async (req, res) => {
  try {
    const updateDetails = req.body
    const { authorization } = req.headers
    const token = authorization.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("decoded ==>", decoded)

    // console.log(req.headers)

    const updateResult = await Users.findByIdAndUpdate(decoded.id, updateDetails)
    console.log("updateResult ==>", updateResult)

    successResponseHandler(200, true, "User updated successfully", null, res)
  } catch (err) {
    errorResponseHandler(500, false, "error updating user: " + err.message, res)
  }
}

module.exports = { getUsersController, updateUserController }