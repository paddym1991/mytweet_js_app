const mongoose = require('mongoose');

/**
 * Module to represent a Schema for a Tweet model
 */

const tweetSchema = mongoose.Schema({
  tweetText: String,
  method: String,
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
