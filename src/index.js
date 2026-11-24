const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRouter = require("./routes/authRoute.js");
const usersRouter = require("./routes/usersRoute.js");
require("dotenv").config();

const app = express();
app.use(cors())
app.use(express.json())
connectDB();

app.use("/api/auth", authRouter)
app.use("/api/users", usersRouter)

app.get("/health", (req, res) => {
  res.send({
    status: true,
    message: "Server is working fine."
  })
})

app.use((err, req, res, next) => {
  console.log("error from middleware", err)
  next(err)
  // res.status(500).json({
  //   status: false,
  //   error: err
  // })
})

app.use((err, req, res, next) => {
  console.log("error from second middleware", err)
  res.send(err)
})

app.listen(process.env.PORT, () => {
  console.log("Server is now running on port", process.env.PORT)
})

module.exports = app;