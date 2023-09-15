const db = require("../models/schemas")
const Card = db.Card

// Create and Save a new card
exports.create = async(req, res) => {
  // Validate request
//   if (!req.body.title) {
//     res.status(400).send({ message: "Content can not be empty!" });
//     return;
//   }
  // Create a card
  const newCard = new Card({
    name: req.body.name,
    deck: req.body.desk,
    type: req.body.type,
    rarity: req.body.rarity
  });

  // Save card in the database
  const saveCard = await newUser.save()
  if (saveCard) {
    console.log(newCard)
    res.send('User saved. Thank you.')
    } else {
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the user."})
}

};

// Retrieve all cards from the database.
exports.findAll = async(req, res) => {
    await Card.find({})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving cards."
        });
      });
};

// Retrieve all cards from the database.
exports.findAllDeck = async(req, res) => {
    const deck = req.query.deck;
    var condition = deck ? { deck: { $regex: new RegExp(title), $options: "i" } } : {};
  
    await Card.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving cards."
        });
      });
};

// Find a single card with an id
exports.findOne = async(req, res) => {
    const id = req.params.id;

    await Card.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found card with id " + id });
        else res.send(data);
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