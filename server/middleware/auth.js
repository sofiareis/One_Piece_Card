const jwt = require("jsonwebtoken")
require('dotenv').config();

exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.CRYPTO, (err, decodedToken) => {
        if (err) {
          //req.isAuth = false;
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (!decodedToken) {
            //req.isAuth = false;
            return res.status(401).json({ message: "Not authorized" })
          } else {
            //req.isAuth = true;
            req.userId = decodedToken.id;
            next()
          }
        }
      })
    } else {
      //req.isAuth = false;
      return res.status(401).json({ message: "Not authorized, token expired" })
    }
  }