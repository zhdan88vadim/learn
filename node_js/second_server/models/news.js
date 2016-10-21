var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
    name: String,
    type: String,
    pages: Number
});

module.exports = mongoose.model('News', NewsSchema);