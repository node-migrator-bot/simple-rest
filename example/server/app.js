var rest = require('../../lib/rest');

rest.configure(function(rest) {
	rest.mongoose.host = 'localhost';
	rest.mongoose.port = 27017;
	rest.mongoose.db = 'db';

	rest.paths.controllers = __dirname + '/controllers/';
	rest.paths.models = __dirname + '/models/';
});

rest.listen(5000);


