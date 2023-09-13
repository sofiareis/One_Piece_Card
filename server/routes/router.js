const express = require("express")
const router = express.Router()
const schemas = require('../models/schemas')

router.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

  
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


router.get("/card", async(req, res) => {
  const card = schemas.Card
  const cardData = await card.find({}).exec()
  if (cardData) {
    res.send(JSON.stringify(cardData))
   } 
})


module.exports = router