// ./src/controllers/butcher.controller.js

const Slaughter = require("../models/slaughter.model");

/**
 * It's an asynchronous function that uses the await keyword to wait for the result of the find()
 * method on the Slaughter model.
 *
 * The find() method returns a promise, which is why we can use the await keyword.
 * @param req - The request object. This object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getSlaughtered = async (req, res) => {
    try {
      const slaughtered = await Slaughter.find();
      res.status(200).json(slaughtered);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
/**
 * It's an asynchronous function that uses the slaughter model to find a slaughter by its id, and then
 * sends a response with the slaughter's data.
 * @param req - The request object.
 * @param res - The response object.
 */
const getSingleSlaughtered = async (req, res) => {
    try {
      console.log("id =>", req.params.id)
      const slaughtered = await Slaughter.findById(req.params.id);
      console.log("slaughtered =>", slaughtered)
      res.status(200).json(slaughtered);
    } catch (error) {
      res.status(500).json(error);
    }
  };


/**
 * It creates a new slaughter using the data from the request body and returns the created slaughter in the
 * response.
 * @param req - The request object. This object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const insertSlaughtered = async (req, res) => {
    try {
      console.log('we are inserting hello')
      console.log(req.body)
      const slaughtered = await Slaughter.create(req.body);
      res.status(201).json(slaughtered);
    } catch (error) {
      res.status(500).json(error);
    }
  };


/**
 * It takes the id of the slaughter to be updated from the request params, and the updated slaughter data
 * from the request body, and then updates the slaughter in the database with the new data, and returns
 * the updated slaughter to the client.
 * @param req - The request object.
 * @param res - The response object.
 */
const updateSlaughtered = async (req, res) => {
    try {
      const slaughtered = await Slaughter.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(slaughtered);
    } catch (error) {
      res.status(500).json(error);
    }
  };

/**
 * It finds a slaughter by its id and deletes it.
 * @param req - The request object. This object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const deleteSlaughtered = async (req, res) => {
    try {
      const slaughtered = await Slaughter.findByIdAndDelete(req.params.id);
      res.status(200).json(slaughtered);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  /**
 * It finds a slaughter by its id and deletes it.
 * @param req - The request object. This object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const deleteAllSlaughtered = async (req, res) => {
  try {
    const slaughtered = await Slaughter.remove({});
    res.status(200).json(slaughtered);
  } catch (error) {
    res.status(500).json(error);
  }
};


module.exports = {
    insertSlaughtered,
    getSlaughtered,
    deleteSlaughtered,
    updateSlaughtered,
    getSingleSlaughtered,
    deleteAllSlaughtered
};