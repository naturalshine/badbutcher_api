const express = require("express");

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser')

const ButcherRoutes = require("./routes/butcher.route");

const app = express();

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

/* A middleware that parses the body of the request and makes it available in the req.body object. */
app.use(express.json());

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(cors({
  origin: 'http://localhost:3000'
}));

// adding morgan to log HTTP requests
app.use(morgan('combined'));


/* This is the root route. It is used to check if the server is running. */
app.get("/", (req, res) => {
  res.status(200).json({ alive: "True" });
});



/* Telling the server to use the routes in the ButcherRoutes file. */
app.use("/api", ButcherRoutes);


module.exports = app;