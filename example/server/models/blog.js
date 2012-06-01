var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.ObjectId;

module.exports = mongoose.model('Blog', new Schema({
	title: String,
	content: String
}, {
	strict: true
}));
