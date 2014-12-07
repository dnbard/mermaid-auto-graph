var mongoose = require('mongoose');

mongoose.model('Url', {
    _id: {type:String, index: true},
    text: String,
    timestamp: Date,
    views: Number
});
