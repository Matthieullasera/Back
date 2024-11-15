const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: String, required: true },
  genre: { type: String, required: true },
  ratings: { type: String, required: true },
  averageRating: { type: String, required: true },
});

module.exports = mongoose.model('Thing', thingSchema);