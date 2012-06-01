var express = require('express'),
	mongoose = require('mongoose'),
	path = require('path'),

	Controller = require('./controller');

var Rest = function() {
	this._ctor.apply(this, arguments);
};

Rest.prototype._ctor = function() {	
	this.mongoose = {
		host:'localhost',
		port: 27017,
		db: 'db'
	};

	this.paths = {
		controllers: __dirname + '/controllers/',
		models: __dirname + '/models/'
	};
	
	this._app = express.createServer();
	
	this._controllers = {};
	this.controller = Controller;
};

Rest.prototype.configure = function(callback) {
	callback.call(this, this);
};

Rest.prototype._requireController = function(url, callback, context) {
	var self = this;
	
	context = (context || this);
	url = url.replace('_', '/');
	
	if (this._controllers[url] !== undefined) {
		callback.call(context, this._controllers[url] !== null ? this._controllers[url] : this._controllers.default);
	} else {
		path.exists(self.paths.controllers + url + '.js', function(exists) {
			if (exists) {
				self._controllers[url] = new (require(self.paths.controllers + url))(self);
				callback.call(context, self._controllers[url]);
			} else {
				self._controllers[url] = null;
				callback.call(context, self._controllers.default);
			}	
		});
	}
}

Rest.prototype._init = function() {
	var self = this;

	this._controllers.default = new this.controller(this);

	mongoose.connect('mongodb://'+this.mongoose.host+':'+this.mongoose.port+'/'+this.mongoose.db);
	
	this._app.configure(function() {
		self._app.use(express.bodyParser());
		self._app.use(express.methodOverride());
		self._app.use(express.cookieParser());
	});

	this._app.all('*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "POST,GET,DELETE,PUT,OPTIONS");
		res.header("Access-Control-Allow-Headers", "Content-Type");
		next();
	});

	this._app.get('/:url/:id?', function(req, res, next) {
		self._requireController(req.params.url, function(controller) {
			controller.get.call(controller, req, res, next);
		});
	});

	this._app.post('/:url', function(req, res, next) {
		self._requireController(req.params.url, function(controller) {
			controller.post.call(controller, req, res, next);
		});
	});

	this._app.put('/:url/:id', function(req, res, next) {
		self._requireController(req.params.url, function(controller) {
			controller.put.call(controller, req, res, next);
		});
	});

	this._app.delete('/:url/:id', function(req, res, next) {
		self._requireController(req.params.url, function(controller) {
			controller.delete.call(controller, req, res, next);
		});
	});
};

Rest.prototype.listen = function() {
	this._init();

	this._app.listen.apply(this._app, arguments);

	console.log("rest is listening on port %d", Array.prototype.slice.call(arguments));
};

module.exports = new Rest();
