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
    let existUser = await User.find({"username" : username})
    console.log(existUser)
    console.log(username)
    if(existUser.length != 0){
      return res.status(400).json({
        message: "User not successful created",
        error: "Username already exists",
      })
    }

    // Hash the password and create a user
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        username,
        password: hash,
        cardCollection: req.body.userCollection ? req.body.userCollection : null,
        missing: req.body.missing ? req.body.missing : null,
        wishing: req.body.wishing ? req.body.wishing : null,
      })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, cardCollection: user.cardCollection, missing: user.missing, 
            wishing: user.wishing, entryDate: user.entryDate, role: user.role },
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
          user: user
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
  
  await User.findOne({username})
  .then(user => {
    if(!user) {
      res.status(401).json({message: "Login not successful", error: "User not found"})
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, cardCollection: user.cardCollection, missing: user.missing, 
              wishing: user.wishing, entryDate: user.entryDate, role: user.role },
              process.env.CRYPTO,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          console.log(user.role);
          res.status(201).json({
            message: "User successfully Logged in",
            user: user,
          });
        } else {
          res.status(400).json({ message: "Login not succesful", error: "Wrong password" });
        }
      });
    }
  })
  .catch (err => {
    res.status(400).json({
      message: "Some error occurred while retrieving users.",
      error: err.message
    });
  });
  
};

// Retrieve all users from the database.
exports.findAll = async(req, res) => {
    await User.find({})
      .then(data => {
        res.status(201).json(data);
      })
      .catch(err => {
        res.status(500).json({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
};

// Find a single user with an id
exports.findOne = async(req, res) => {
    const _id = req.params.id;

    await User.findById(_id)
      .then(data => {
        if (!data)
          res.status(404).json({ message: "Not found user with id " + _id });
        else res.status(201).json(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Error retrieving user with id=" + _id });
      });
};

// Find a single user with an id
exports.findOneUsername = async(req, res) => {
  const username = req.params.username;

  await User.find({"username" : username})
    .then(data => {
      if (!data)
        res.status(404).json({ message: "Not found user with username " + username });
        else res.status(201).json(data.username);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Error retrieving user with username=" + username });
    });
};

// Update a user by the id in the request
exports.update = async(req, res) => {
    if (!req.body || !req.params.id) {
        return res.status(400).json({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
    await User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).json({
              message: `Cannot update user with id=${id}. Maybe user was not found!`
            });
          } else res.status(201).json({ message: "user was updated successfully." });
        })
        .catch(err => {
          res.status(500).json({
            message: "Error updating user with id=" + id
          });
        });
};

// Delete a user with the specified id in the request
exports.delete = async(req, res) => {
    const id = req.params.id;

    await User.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `Cannot delete user with id=${id}. Maybe user was not found!`
          });
        } else {
          res.status(201).json({
            message: "user was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "Could not delete user with id=" + id
        });
      });
};

// Delete all users from the database.
exports.deleteAll = async(req, res) => {
    await User.deleteMany({})
    .then(data => {
      res.status(201).json({
        message: `${data.deletedCount} users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};



/*
exports.login = async(req, res) => {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const { authId } = req.body;
  
    try {
        //check if passed token is valid
        const ticket = await client.verifyIdToken({
            idToken: authId,
            audience: process.env.CLIENT_ID
        });
  
        //get metadata from the id token, to be saved in the db
        const { name, email } = ticket.getPayload();
  
        //this value will be passed thru cookie
        const loginToken = jwt.sign(`${email}`, secretkey.key);
  
        //upsert is true, this option enables mongoose to create a new entry if there is no existing record matching the filter
        await User.findOneAndUpdate({
            email
        }, {
            name,
        }, {
            upsert: true
        });
  
        //creating a cookie name "login", which will expire after 3600000 milliseconds from the time of creation
        //the value of the cookie is a jwt, created using the email id of the google user
        //later on each call we will deconde this message using secret key and check if user is authenticated
  
        res.status(200).cookie('login', loginToken, { expire: 3600000 + Date.now() }).json({
            success: true
        });
    }
    catch (e) {
        res.status(500).json({
            error: e
        });
    }
  };
  
  
  exports.logout = async(req, res) => {
    //logout function
    try {
        res.clearCookie('login').json({
            'success': true
        });
    }
    catch (e) {
        res.status(500).json({
            error: e
        });
    }
  };
  
  
  exports.checkLogin = async(req, res) => {
    //check if user is logged in already
    try {
        res.status(200).json({
            'success': true
        });
    }
    catch (e) {
        res.status(500).json({
            error: e
        });
    }
  };
  */

  /*

  const newUser = new User({
        username: username,
        password: password,
        cardCollection: req.body.userCollection ? req.body.userCollection : null,
        missing: req.body.missing ? req.body.missing : null,
        wishing: req.body.wishing ? req.body.wishing : null,
    });
    // Save user in the database
    const saveUser = await newUser.save()
    if (saveUser) {
        console.log(newUser)
        res.json('User saved. Thank you.')
    } else {
        res.status(500).json({
        message:
          err.message || "Some error occurred while creating the user."})
    }
  */