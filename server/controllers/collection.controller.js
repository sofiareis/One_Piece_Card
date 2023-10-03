const db = require("../models/schemas")
const { default: mongoose } = require("mongoose");
const User = db.Users

exports.getCollection = async(req, res) => {
    if (!req.userId) {
      return res.status(400).json({
        message: "Need user id"
      });
    }
    const id = req.userId;
    await db.Users.
      findOne({ _id: id }).
      populate('cardCollection.card').
      exec()
      .then(data => {
        console.log(data)
        if (!data) {
          res.status(404).json({
            message: `Cannot get user collection with id=${id}. Maybe user was not found!`
          });
        } else res.status(201).json({ message: "Got user collection successfully.", card: data.cardCollection });
      })
      .catch(err => {
        res.status(500).json({
          message: err.message
        });
      });
  }
  
  //if card doesnt match it returns null for the card bruh
  exports.getCollectionCondition = async(req, res) => {
    if (!req.userId) {
      return res.status(400).json({
        message: "Need user id"
      });
    }
    const id = new mongoose.Types.ObjectId(req.userId)
    const { deck, name } = req.query;
    var condition = {
      name: {$regex: name},
      deck: deck ? deck : ["OP01", "OP02", "OP03", "OP04", "OP05"],
    };
    await User.aggregate([
      {$match: {_id: id }},
      {$unwind: {path: '$cardCollection'}},
      {$lookup:{
          from: 'card',
          localField: 'cardCollection.card',
          foreignField: '_id',
          as: 'card'
      }},
      {$match: condition},
      {
        $addFields: {
          card: { $arrayElemAt: ['$card', 0] },
        },
      },
      { $project : { 
        _id: 0, 
        card: 1,
        quantity: '$cardCollection.quantity'
        } 
      }
  ])
  .exec()
  .then(async data => {
        console.log(data)
        if (!data) {
          res.status(404).json({
            message: `Cannot get user collection with id=${id}. Maybe user was not found!`
          });
        } else {
            res.status(201).json({ message: "Got user collection successfully.", card: data });
          }
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });
        });
  }

  // Update a user by the id in the request
exports.updateCardCollection = async(req, res) => {
    if (!req.body.params || !req.userId) {
        return res.status(400).json({
          message: "Data to update can not be empty!"
        });
      }
      const id = req.userId
    try{
      let user = await User.findOne({_id : id})
      if(!user) {
        res.status(401).json({message: "Couldnt find user", error: "User not found"})
      } 
      else {
        let card = await db.Users.findOne({_id : id, "cardCollection.card" : req.body.params.card })
        //that card doesnt exist, so push one
        if(!card){
          await User.updateOne(
            {_id : id },
            {$push : {cardCollection : {card: req.body.params.card, quantity: 1}}}
          ).then(data => {
            if (!data) {
              res.status(404).json({
                message: `Cannot update user with id=${id}. Maybe user was not found!`
              });
            } else res.status(201).json({ message: "User collection was updated successfully." });
          })
          .catch(err => {
            res.status(500).json({
              message: err.message
            });
          });
        } 
        else{
           //that card doesnt exist, so change quantity
          await User.updateOne(
            {_id : id, "cardCollection.card" : req.body.params.card },
            { 'cardCollection.$.quantity': req.body.params.quantity},
          ).then(data => {
            if (!data) {
              res.status(404).json({
                message: `Cannot update user with id=${id}. Maybe user was not found!`
              });
            } else res.status(201).json({ message: "User collection was updated successfully." });
          })
          .catch(err => {
            res.status(500).json({
              message: err.message
            });
          });
        }
      }
    } catch (error){
      console.log(error)
    }
  };

  //Delete card from collection