var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.ObjectId;

var schema = new Schema({
	firstname: String,
	lastname: String
}, {
	strict: true
});

module.exports.Schema = schema;
module.exports.Model = mongoose.model('User', schema);
