const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//TODO update w metadata

/* This is creating a new schema for the SLAUGHTER model. */
const slaughterSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    chain: {
      type: String,
    }, 
    projectName: {
      type: String,
    },
    originalImage: {
      type: String, 
    },
    slaughteredImage: {
      type: String,
    },
    imagePieces: {
      type: Array,
    },
    butcheredContract: {
      type: String,
    },
    butcheredTokenId: {
      type: String,
    },
    ownerOfButcheredToken: {
      type: String,
    },
    butcheredProjectName: {
      type: String,
    },
    butcheredSymbol: {
      type: String,
    },
    butcheredRoyaltyHolder: {
      type: String,
    },
    butcheredRoyaltyAmount: {
      type: String,
    },
    royaltyHolder: {
      type: String,
    },
    royaltyAmount: {
      type: Decimal128,
    }, 
    minterAddress: {
      type: String,
    },
    symbol:{
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slaughter", slaughterSchema);

