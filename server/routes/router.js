const express = require("express")
const router = express.Router()
const card = require('../controllers/card.controller')
const auth = require('../controllers/auth.controller')
const collection = require('../controllers/collection.controller')
const wishlist = require('../controllers/wishlist.controller')
const missing = require('../controllers/missing.controller')
const { userAuth } = require("../middleware/auth")
const { urlencoded } = require("body-parser")

router.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });


// Create a new user
router.post("/user", auth.create);

// Login a user
router.post('/login', auth.login);



// Retrieve a users collection
router.get("/collection", userAuth, collection.getCollection);

// Retrieve a users collection with condition
router.get("/collection/condition", userAuth, collection.getCollectionCondition);

// Update user's collection
router.put("/userUpdateCollection", userAuth, collection.updateCardCollection);



// Retrieve a users wishlist with id
router.get("/wishlist", userAuth, wishlist.getWishlist);

// Update user's wishlist
router.put("/userUpdateWishlist",userAuth, wishlist.updateWishlist);



// Retrieve a users missing cards with id
router.get("/missing", userAuth, missing.getMissing);



// Retrieve all card
router.get("/card", userAuth, card.findAll);

// Retrieve all cards by condition
router.get("/card/condition", userAuth, card.findCard);

// Retrieve a single card with id
router.get("/card", userAuth, card.findOne);

module.exports = router