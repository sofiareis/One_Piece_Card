const db = require("../models/schemas")
require('dotenv').config();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const User = db.Users

// Create and Save a new user
exports.create = async(req, res) => {
    const { username, password } = req.body;
    // Validate request
    if (!username || !password) {
        res.status(400).json({ message: "Content can not be empty!", error: "Username or password missing" });
        return;
    }
    if (req.body.password.length < 5) {
      return res.status(400).json({ message: "Password less than 5 characters", error: "Password can't have less than 5 characters" })
    }
    const existUser = await User.findOne({"username" : username});
    if(existUser){
      return res.status(400).json({
        message: "User not successful created",
        error: "Username already exists",
      })
    }

    // Hash the password and create a user
    await bcrypt.hash(password, 10).then(async (hash) => {
      const user = new User({
        username,
        password: hash,
      })

      await user.save().then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, entryDate: user.entryDate},
          process.env.CRYPTO,
          {
            expiresIn: maxAge, // 3hrs in sec
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3hrs in ms
        });
        res.status(201).json({
          message: "User successfully created",
          user: user._id
        });
      })
      .catch((err) =>
        res.status(400).json({
          message: "User not successful created",
          error: err.message,
        })
      );
    });
    
};

//Check if user exists and login
exports.login = async(req, res) => {
    const { username, password } = req.body
    // Validate request
    if (!username || !password) {
        res.status(400).json({ message: "Content can not be empty!", error: "Username or password missing" });
        return;
    }
    const user = await User.findOne({username});
    if(!user) {
      res.status(401).json({message: "Login not successful", error: "User not found"})
    } else {
      // comparing given password with hashed password
      await bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username , entryDate: user.entryDate},
              process.env.CRYPTO,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user,
          });
        } else {
          res.status(400).json({ message: "Login not succesful", error: "Wrong password" });
        }
      });
    }
};