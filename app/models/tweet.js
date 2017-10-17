const mongoose = require('mongoose');

/**
 * Module to represent a Schema for a Tweet model
 */

const tweetSchema = mongoose.Schema({
  amount: Number,
  method: String,
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
