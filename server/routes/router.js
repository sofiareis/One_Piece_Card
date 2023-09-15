const express = require("express")
const router = express.Router()
const schemas = require('../models/schemas')
const card = require('../controllers/card.controller')
const user = require('../controllers/user.controller')
const { OAuth2Client } = require('google-auth-library');

router.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

/*  
router.post('/users/:a', async(req, res) => {
    const {name, email} = req.body 
    const action = req.params.a
    console.log(action)
  
    switch(action) {
      case "save":
        const userData = {name: name, email: email}
        console.log(name + ' | ' + email )
        const newUser = new schemas.Users(userData)
        const saveUser = await newUser.save()
        if (saveUser) {
          console.log(newUser)
          res.send('User saved. Thank you.')
        } else {
          res.send('Failed to save user.')
        }
        break;
  
        default:
          res.send('Invalid Request')
          break
    }
  
    res.end()
})
*/

// Create a new user
router.post("/user", user.create);

// Retrieve all user
router.get("/user", user.findAll);

// Retrieve a single user with id
router.get("/user/:id", user.findOne);

// Update a user with id
router.put("/user/:id", user.update);

// Delete a user with id
router.delete("/user/:id", user.delete);

// Delete all user
router.delete("/user", user.deleteAll);

app.post('/login/user', user.login);

app.get('/logout/user', user.logout);

app.get('/user/checkLoginStatus', user.checkLogin);

app.get('/user/authenticated/getAll', authenticateUser, async (req, res) => {
  //authenticateUser is the middleware where we check if the use is valid/loggedin
  try {
      const data = await Login.find({});
      res.status(200).send({
          users: data
      });
  }
  catch (e) {
      res.status(500).send({
          error: e
      });
  }
});


/*
router.get("/card", async(req, res) => {
  const card = schemas.Card
  const cardData = await card.find({}).exec()
  if (cardData) {
    res.send(JSON.stringify(cardData))
   } 
})
*/

// Create a new card
router.post("/card", card.create);

// Retrieve all card
router.get("/card", card.findAll);

// Retrieve all cards based on deck
router.get("/card/:deck", card.findAllDeck);

// Retrieve a single card with id
router.get("/card/:id", card.findOne);

// Update a card with id
router.put("/card/:id", card.update);

// Delete a card with id
router.delete("/card/:id", card.delete);

// Delete all card
router.delete("/card", card.deleteAll);


module.exports = router