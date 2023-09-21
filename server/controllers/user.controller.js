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
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    if (req.body.password.length < 5) {
      return res.status(400).json({ message: "Password less than 5 characters" })
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
        res.send(
          "User successfully created"
        );
      })
      .catch((err) =>
        res.status(400).send({
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
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  
  await User.findOne({username})
  .then(user => {
    if(!user) {
      res.status(401).send({message: "Login not successful", error: "User not found"})
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
          res.status(201).json({
            message: "User successfully Logged in",
            user: user._id,
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
      });
    }
  })
  .catch (err => {
    res.status(400).send({
      message: "Some error occurred while retrieving users.",
      error: err.message
    });
  });
  
};

// Retrieve all users from the database.
exports.findAll = async(req, res) => {
    await User.find({})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
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
          res.status(404).send({ message: "Not found user with id " + _id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving user with id=" + _id });
      });
};

// Update a user by the id in the request
exports.update = async(req, res) => {
    if (!req.body || !req.params.id) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
    await User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update user with id=${id}. Maybe user was not found!`
            });
          } else res.send({ message: "user was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
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
          res.status(404).send({
            message: `Cannot delete user with id=${id}. Maybe user was not found!`
          });
        } else {
          res.send({
            message: "user was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete user with id=" + id
        });
      });
};

// Delete all users from the database.
exports.deleteAll = async(req, res) => {
    await User.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
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
  
        res.status(200).cookie('login', loginToken, { expire: 3600000 + Date.now() }).send({
            success: true
        });
    }
    catch (e) {
        res.status(500).send({
            error: e
        });
    }
  };
  
  
  exports.logout = async(req, res) => {
    //logout function
    try {
        res.clearCookie('login').send({
            'success': true
        });
    }
    catch (e) {
        res.status(500).send({
            error: e
        });
    }
  };
  
  
  exports.checkLogin = async(req, res) => {
    //check if user is logged in already
    try {
        res.status(200).send({
            'success': true
        });
    }
    catch (e) {
        res.status(500).send({
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
        res.send('User saved. Thank you.')
    } else {
        res.status(500).send({
        message:
          err.message || "Some error occurred while creating the user."})
    }
  */