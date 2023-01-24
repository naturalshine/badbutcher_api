const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* This is creating a new schema for the SLAUGHTER model. */
const slaughterSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    butcheredChain: {
      type: String,
    }, 
    project: {
      type: String,
    },
    originalImage: {
      type: String, 
    },
    butcheredImage: {
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
    butcheredOwner: {
      type: String,
    },
    butcheredProject: {
      type: String,
    },
    butcheredName: {
      type: String,
    },
    butcheredSymbol: {
      type: String,
    },
    butcheredRoyaltyHolder: {
      type: String,
    },
    butcheredRoyalty: {
      type: String,
    },
    royaltyHolder: {
      type: String,
    },
    royalty: {
      type: Decimal128,
    }, 
    butcherMinter: {
      type: String,
    },
    butcheredMetadataUrl:{
      type: String,
    },
    butcheredImageUrl:{
      type: String,
    },
    ipfsImage:{
      type: String,
    },
    ipfsMetadata:{
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slaughter", slaughterSchema);



  