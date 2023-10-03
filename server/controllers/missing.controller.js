const db = require("../models/schemas");
const Card = db.Card
const User = db.Users
const { default: mongoose } = require("mongoose");

exports.getMissing = async(req, res) => {
    if (!req.userId) {
      return res.status(400).json({
        message: "Need user id"
      });
    }
    const id = req.userId;
          
    try{
        const userCards = await User.findOne({ _id: id }, { 'cardCollection.card': 1 });
        const userCardIds = userCards.cardCollection.map((item) => item.card);
        const missingCards = await Card.find({ _id: { $nin: userCardIds } });
        res.status(201).send({ message: 'Got user missing cards', card: missingCards });
    } catch(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cards."
      });
    };
    
  }