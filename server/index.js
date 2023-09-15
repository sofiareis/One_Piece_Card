require('dotenv').config();
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const router = require('./routes/router')
const { OAuth2Client } = require('google-auth-library');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose")


const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(cookieParser());
app.use('/', router)

const dbOptions = {useNewUrlParser:true, useUnifiedTopology:true}
mongoose.connect(process.env.DB_URI, dbOptions)
.then(() => console.log('DB Connected'))
.catch(err => console.log(err))

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

