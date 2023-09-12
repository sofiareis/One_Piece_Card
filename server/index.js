const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const router = require('./routes/router')

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
app.use('/', router)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

