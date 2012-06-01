var rest = require('./rest'),
	Controller = require('./app/controller');

rest.configure(function(rest) {
	rest.auth.secret = 'cat';

	rest.mongoose.host = 'localhost';
	rest.mongoose.port = 27017;
	rest.mongoose.db = 'db';

	rest.paths.controllers = __dirname + '/controllers/';
	rest.paths.models = __dirname + '/models/';

	rest.controller = Controller;
});


rest.listen(5000);


