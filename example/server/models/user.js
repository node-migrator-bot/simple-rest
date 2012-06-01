var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.ObjectId;

module.exports = mongoose.model('User', new Schema({
	firstname: String,
	lastname: String
}, {
	strict: true
}));
