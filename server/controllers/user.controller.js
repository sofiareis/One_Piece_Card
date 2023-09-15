const db = require("../models/schemas")
const User = db.Users

// Create and Save a new user
exports.create = async(req, res) => {
    // Validate request
    if (!req.body.name || !req.body.email) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    // Create a user
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
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
    const id = req.params.id;

    await User.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found user with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving user with id=" + id });
      });
};

// Update a user by the id in the request
exports.update = async(req, res) => {
    if (!req.body) {
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