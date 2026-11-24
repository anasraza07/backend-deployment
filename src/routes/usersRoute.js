const express = require("express");
const { getUsersController, updateUserController } = require("../controllers/usersController");
const usersRouter = express.Router();

usersRouter.get("/", getUsersController)
usersRouter.patch("/", updateUserController)

// authRouter.post("/login", (req, res) => {

// })

module.exports = usersRouter;