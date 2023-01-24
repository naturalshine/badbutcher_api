const express = require("express");

require('dotenv').config();

const {
  getSlaughtered,
  getSingleSlaughtered,
  updateSlaughtered,
  deleteSlaughtered,
  insertSlaughtered,
} = require("../controllers/butcher.controller");

const { authenticateToken } = require("../middlewares/auth");
const { doButcher } = require('../services/butcher');
const { loginSlaughtered } = require('../services/login');

const router = express.Router();

/* Creating the routes for the slaughter controller. */
router.get("/slaughtered", authenticateToken, getSlaughtered);

router.get("/slaughtered/:id", authenticateToken, getSingleSlaughtered);

router.post("/slaughtered", authenticateToken, insertSlaughtered);

router.patch("/slaughtered/:id", authenticateToken, updateSlaughtered);

router.delete("/slaughtered/:id", authenticateToken, deleteSlaughtered);

router.post("/login", loginSlaughtered);

router.post("/butcher", authenticateToken, doButcher);

module.exports = router;

