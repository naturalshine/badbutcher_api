const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express()

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

const {startDatabase} = require('./database/mongo');
const {insertSlaughtered, getSlaughtered, deleteSlaughtered, updateSlaughtered} = require('./database/slaughtered');
const { authenticateToken } = require("./utils/handlers")

// endpoint to add a slaughtered NFT
app.post('/', authenticateToken, async (req, res) => {
  const newSlaughter = req.body;
  await insertSlaughtered(newSlaughter);
  res.send({ message: 'New slaughtered NFT inserted.' });
});

// endpoint to delete a slaughtered NFT
app.delete('/:id', authenticateToken, async (req, res) => {
  await deleteSlaughtered(req.params.id);
  res.send({ message: 'Slaughtered NFT removed.' });
});

// endpoint to update a slaughtered NFT
app.put('/:id', authenticateToken, async (req, res) => {
  const slaughteredUpdate = req.body;
  await updateSlaughtered(req.params.id, slaughteredUpdate);
  res.send({ message: 'Slaughtered NFT updated.' });
});

// endpoint to view data
app.get('/', authenticateToken, async (req, res) => {
  res.send(await getSlaughtered());
});

// endpoint to login and receive a JWT to sign future requests
app.post('/login', async(req, res) => {
	const { username, password } = req.body

	if (!username || !password || process.env.JWT_USER != username || process.env.JWT_PW !== password) {
    return res.status(401).end()
	}

	const token = jwt.sign({ username }, process.env.JWT_SECRET, {
		algorithm: "HS256",
		expiresIn: 1800,
	})

  res
  .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged in successfully 😊 👌" });
});

//start the app
startDatabase().then(async () => {
  // dummy data for dev
  await insertSlaughtered({title: 'Hello, now from the in-memory database!'});

  app.listen(process.env.PORT, async () => {
    console.log('listening on port ' + process.env.PORT);
  });
});


