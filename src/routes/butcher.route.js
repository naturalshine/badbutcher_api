const express = require("express");
const path = require('path');
require('dotenv').config();

const {
  getSlaughtered,
  getSingleSlaughtered,
  updateSlaughtered,
  deleteSlaughtered,
  insertSlaughtered,
  deleteAllSlaughtered
} = require("../controllers/butcher.controller");

const { authenticateToken } = require("../middlewares/auth");
const { doButcher } = require('../services/doButcher');
const { doUpload } = require('../services/doUpload');
const { doMint } = require('../services/doMint');
const { loginSlaughtered } = require('../services/doLogin');

const router = express.Router();

/* Creating the routes for the slaughter controller. */
router.get("/slaughtered", authenticateToken, getSlaughtered);

router.get("/slaughtered/:id", authenticateToken, getSingleSlaughtered);

router.post("/slaughtered", authenticateToken, insertSlaughtered);

router.patch("/slaughtered/:id", authenticateToken, updateSlaughtered);

router.delete("/slaughtered/:id", authenticateToken, deleteSlaughtered);

router.delete("/delete", authenticateToken, deleteAllSlaughtered);

router.post("/login", loginSlaughtered);

router.post("/butcher", authenticateToken, doButcher);

router.post("/upload", authenticateToken, doUpload);

router.post("/mint", authenticateToken, doMint);

module.exports = router;

