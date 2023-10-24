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
    try{
      const data = await db.Users.
      findOne({ _id: id }).
      populate('cardCollection.card').
      exec()

      if (!data) {
        return res.status(404).json({
          message: `Cannot get user collection with id=${id}. Maybe user was not found!`
        });
      } 
        
      const sortedCollection = data.cardCollection.sort((a, b) => {
        const nameA = a.card.name.toUpperCase();
        const nameB = b.card.name.toUpperCase();
        return nameA.localeCompare(nameB);
      });

      res.status(200).json({ message: "Got user collection successfully.", card: data.cardCollection });
      
    } catch(err) {
        res.status(500).json({
          message: err.message
        });
      }
  }
  

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
        if (!data) {
          res.status(404).json({
            message: `Cannot get user collection with id=${id}. Maybe user was not found!`
          });
        } else {
            res.status(200).json({ message: "Got user collection successfully.", card: data });
          }
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });
        });
  }

// Update user's card quantity
exports.quantityCardCollection = async(req, res) => {
    if (!req.body.params || !req.userId) {
        return res.status(400).json({
          message: "Data to update can not be empty!"
        });
      }
      const id = req.userId
    try{
        let card = await db.Users.findOne({_id : id, "cardCollection.card" : req.body.params.card })
        if(card){
           //that card does exist, so change quantity
          await User.updateOne(
            {_id : id, "cardCollection.card" : req.body.params.card },
            { 'cardCollection.$.quantity': req.body.params.quantity},
          ).then(data => {
            if (!data) {
              res.status(404).json({
                message: `Cannot update user with id=${id}. Maybe user was not found!`
              });
            } else res.status(200).json({ message: "User collection was updated successfully." });
          })
          .catch(err => {
            res.status(500).json({
              message: err.message
            });
          });
        }
    } catch (error){
      console.log(error)
    }
  };

  // Update user's card collection by adding card
exports.addCardCollection = async(req, res) => {
  if (!req.body.params || !req.userId) {
      return res.status(400).json({
        message: "Data to update can not be empty!"
      });
    }
    const id = req.userId
  try{
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
          } else res.status(200).json({ message: "User collection was updated successfully." });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });
        });
      } 
      else{
        res.status(400).json({ message: "User already has card!" });
      }
  } catch (error){
    console.log(error)
  }
};



//Delete card from collection
exports.deleteCardCollection = async(req, res) => {
  console.log("sdf")
  if (!req.body.params.card || !req.userId) {
    return res.status(400).json({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.userId
  console.log(req.body.params.card)
  try{
    User.updateOne(
        { _id: id },
        { $pull: { cardCollection: { card: req.body.params.card } } }
      )
      .then((data) => {
        if (data.nModified === 0) {
          res.status(404).send({ message: 'Card not found in user collection.' });
        } else {
          res.status(200).send({ message: 'Card removed from user collection.' });
        }
      })
  }catch (error){
    res.status(500).send({
      message: error.message || 'Some error occurred while deleting the card from user collection.',
    });
  }
}
