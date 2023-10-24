const db = require("../models/schemas")
const cardTypes =  require("../models/card.type");
const Card = db.Card

// Create and Save a new card
exports.create = async(req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "Content can not be empty!" });
    return;
  }
  // Create a card
  const newCard = new Card({
    cid: req.body.cid,
    name: req.body.name,
    category: req.body.category,
    color: req.body.color,
    type: req.body.type,
    power: req.body.power,
    rarity: req.body.rarity,
    image: req.body.image,
    alternate: req.body.alternate,
    deck: req.body.deck
  });

  // Save card in the database
  const saveCard = await newCard.save()
  if (saveCard) {
    console.log(newCard)
    res.status(201).send('Card saved. Thank you.')
  } else {
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the card."})
    }
};

// Retrieve all cards from the database.
exports.findAll = async(req, res) => {
    await Card.find({})
      .then(data => {
        res.status(200).json({ message: "Got user collection successfully.", card: data });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving cards."
        });
      });
};

// Retrieve all cards from the database based on condition.
exports.findCard = async(req, res) => {
    const { deck, category, rarity, color, name } = req.query;
    try{
      var condition = {
        //cid: name ? { $regex: new RegExp(name, 'i') } : /.*/, // Case-insensitive name search //{$regex: name},
        name: name ? { $regex: new RegExp(name, 'i') } : /.*/, // Case-insensitive name search //{$regex: name},
        category: category ? category : { $in: cardTypes.category },
        //deck: deck ? deck : { $in: ["OP01", "OP02", "OP03", "OP04", "OP05"] },
        rarity: rarity ? { $in: rarity } : { $in: cardTypes.rarity },
        color: color ? { $in: color } : { $in: cardTypes.color },
      };
      const cards = await Card.find(condition).exec();
      console.log(cards)
      
      res.status(200).send(cards);
    } catch(err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving cards."
        });
      }
};

// Find a single card with an id
exports.findOne = async(req, res) => {
    const id = req.params.id;

    await Card.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found card with id " + id });
        else resstatus(200).send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving card with id=" + id });
      });
};

// Update a card by the id in the request
exports.update = async(req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
    await Card.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update card with id=${id}. Maybe card was not found!`
            });
          } else res.send({ message: "card was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating card with id=" + id
          });
        });
};

// Delete a card with the specified id in the request
exports.delete = async(req, res) => {
    const id = req.params.id;

    await Card.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete card with id=${id}. Maybe card was not found!`
          });
        } else {
          res.send({
            message: "card was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete card with id=" + id
        });
      });
};

// Delete all cards from the database.
exports.deleteAll = async(req, res) => {
    await Card.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} cards were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all cards."
      });
    });
};