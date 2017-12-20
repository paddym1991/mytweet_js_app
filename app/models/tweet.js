const mongoose = require('mongoose');

/**
 * Module to represent a Schema for a Tweet model
 */

const tweetSchema = mongoose.Schema({
  tweetText: String,
  date: Date,
  tweeter: {    //To retrieve further information on the donor use an object reference directly to the User object
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  picture: {
    data: Buffer,
    contentType: String,
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
