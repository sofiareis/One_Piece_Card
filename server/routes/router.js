const express = require("express")
const router = express.Router()
const schemas = require('../models/schemas')
const card = require('../controllers/card.controller')
const user = require('../controllers/user.controller')
const { adminAuth, userAuth} = require("../middleware/auth")
const { urlencoded } = require("body-parser")

router.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

// Create a new user
router.post("/user", user.create);

// Login a user
router.post('/login', user.login);

// Retrieve all user
router.get("/user", adminAuth, user.findAll);

// Retrieve a single user with id
router.get("/user/:id", adminAuth, user.findOne);

// Retrieve a users collection with id
router.get("/collection/:id", userAuth, user.getCollection);

// Retrieve a users collection with id
router.get("/collectionCondition/:id", userAuth, user.getCollectionCondition);

// Retrieve a users wishlist with id
router.get("/wishlist/:id", userAuth, user.getWishlist);

// Retrieve a users missing cards with id
router.get("/missing/:id", userAuth, user.getMissing);



// Update a user with id
router.put("/user/:id", adminAuth, user.update);

router.put("/userUpdateCollection/:id", userAuth, user.updateCardCollection);

router.put("/userUpdateCardQuantity/:id", userAuth, user.updateCardCollectionQuantity);

router.put("/userUpdateWishlist/:id",userAuth, user.updateWishlist);

// Delete a user with id
router.delete("/user/:id", adminAuth, user.delete);

// Delete all user
router.delete("/user", adminAuth, user.deleteAll);


// Create a new card
router.post("/card", adminAuth, card.create);

// Retrieve all card
router.get("/card", userAuth, card.findAll);

// Retrieve all cards by deck
router.get("/deck", userAuth, card.findDeck);

// Retrieve all cards by condition
router.get("/card/condition", userAuth, card.findCard);

// Retrieve a single card with id
router.get("/card/:id", userAuth, card.findOne);

// Update a card with id
router.put("/card/:id", adminAuth, card.update);

// Delete a card with id
router.delete("/card/:id", adminAuth, card.delete);

// Delete all card
router.delete("/card", adminAuth, card.deleteAll);


module.exports = router