const db = require("../models/schemas")
require('dotenv').config();
const User = db.Users
const Card = db.Card


// Retrieve all users from the database.
exports.findAll = async(req, res) => {
    await User.find({})
      .then(data => {
        res.status(201).json(data);
      })
      .catch(err => {
        res.status(500).json({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
};

// Find a single user with an id
exports.findOne = async(req, res) => {
    const _id = req.userId;
    await User.findById(_id)
      .then(data => {
        if (!data)
          res.status(404).json({ message: "Not found user with id " + _id });
        else res.status(201).json(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Error retrieving user with id=" + _id });
      });
};

// Update a user by the id in the request
exports.update = async(req, res) => {
    if (!req.query || !req.userId) {
        return res.status(400).json({
          message: "Data to update can not be empty!"
        });
      }
      const id = req.userId;
    await User.findByIdAndUpdate(id, req.query, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).json({
              message: `Cannot update user with id=${id}. Maybe user was not found!`
            });
          } else res.status(201).json({ message: "user was updated successfully." });
        })
        .catch(err => {
          res.status(500).json({
            message: "Error updating user with id=" + id
          });
        });
};

// Delete a user with the specified id in the request
exports.delete = async(req, res) => {
    const id = req.userId;

    await User.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).json({
            message: `Cannot delete user with id=${id}. Maybe user was not found!`
          });
        } else {
          res.status(201).json({
            message: "user was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "Could not delete user with id=" + id
        });
      });
};

// Delete all users from the database.
exports.deleteAll = async(req, res) => {
    await User.deleteMany({})
    .then(data => {
      res.status(201).json({
        message: `${data.deletedCount} users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};