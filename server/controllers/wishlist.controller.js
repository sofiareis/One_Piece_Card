const db = require("../models/schemas");
const { default: mongoose } = require("mongoose");
const User = db.Users

exports.getWishlist = async(req, res) => {
    if (!req.userId) {
      return res.status(400).json({
        message: "Need user id"
      });
    }
    const id = req.userId;
    
    await db.Users.
      findOne({ _id: id }).
      populate('wishlist').
      exec()
      .then(data => {
        console.log(data.wishlist)
        if (!data) {
          res.status(404).json({
            message: `Cannot get user wishlist with id=${id}. Maybe user was not found!`
          });
        } else res.status(201).json({ message: "Found user wishlist", card: data.wishlist });
      })
      .catch(err => {
        res.status(500).json({
          message: err.message
        });
      });
  }

  
// Update a user by the id in the request
exports.updateWishlist = async(req, res) => {
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
    } else {
        let card = await db.Users.findOne({_id : id, "wishlist" : req.body.params.card })
        //that card doesnt exist, so push one
        if(!card){
          await User.updateOne(
            {_id : id },
            {$push : {wishlist : req.body.params.card}}
          ).then(data => {
            if (!data) {
              res.status(404).json({
                message: `Cannot update user with id=${id}. Maybe user was not found!`
              });
            } else res.status(201).json({ message: "User wishlist was updated successfully." });
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

  //if card doesnt match it returns null for the card bruh
  exports.getWishlistCondition = async(req, res) => {
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
        {$lookup:{
            from: 'card',
            localField: 'wishlist',
            foreignField: '_id',
            as: 'wishlist'
        }},
        {$unwind: {path: '$wishlist'}},
        {$match: condition},
        { $project : { _id : 0, username : 0, password : 0, cardCollection: 0, entryDate: 0 } }
    ])
    .exec()
    .then(async data => {
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