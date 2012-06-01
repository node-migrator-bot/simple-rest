var path = require('path'),
	_ = require('underscore');

var Controller = function() {
	this._ctor.apply(this, arguments);
}

Controller.prototype = {	
	_ctor: function(rest) {
		if (rest) {
			this.paths = rest.paths;
		}
	},
	_models: {},
	_requireModel: function(url, callback, context) {
		var self = this;
		
		context = (context || this);
		url = url.replace('_', '/');

		if (this._models[url] !== undefined) {
			if (this._models[url] !== null) {
				callback.call(context, null, self._models[url]);
			} else {
				callback.call(context, 'model does not exists: ' + url, null);
			}
		} else {
			path.exists(self.paths.models + url + '.js', function(exists) {
				if (exists) {
					self._models[url] = require(self.paths.models + url);
					callback.call(context, null, self._models[url]);
				} else {
					self._models[url] = null;
					callback.call(context, 'model does not exists: ' + url, null);
				}
			});
		}
	},

	_parseQuery: function(req, callback, context) {
		var query = {}, fields = {}, options = {};
		
		context = (context || this);

		if (req.query.limit !== undefined) {
			options.limit = req.query.limit;
			query.limit = null;
		}

		if (req.query.sort !== undefined) {
			options.sort = {};
			options.sort[req.query.sort] = 1;

			if (req.query.dir !== undefined) {
				if (req.query.dir === 'desc') {
					options.sort[req.query.sort] = -1;
				}
			}
		}

		if (req.params.id !== undefined) {
			query._id = req.params.id;
		}

		callback.call(context, query, fields, options);
	},

	_parseSend: function(models) {
		if (_.isArray(models)) {
			var _models = [];

			_.each(models, function(model) {
				_models.push(model.toObject({ getters: true, virtuals: true }));
			});

			return _models;
		} else {
			return models.toObject({ getters: true, virtuals: true });
		}
	},
	
	get: function(req, res, next) {
		var self = this;
		
		this._requireModel(req.params.url, function(err, Model) {
			if (err) {
				res.send({ error: err });
			} else {
				this._parseQuery(req, function(query, fields, options) {
					Model.find(query, fields, options, function(err, models) {
						if (err) { 
							res.send({ error: err });
						} else {
							res.send(self._parseSend(models));
						}
					});
				}, this);
			}
		}, this);
	},

	post: function(req, res, next) {
		var self = this;
		
		this._requireModel(req.params.url, function(err, Model) {
			if (err) {
				res.send({ error: err });
			} else {
				var model = new Model(req.body);
				
				model.save(function(err) {
					if (err) {
						res.send({ error: err });
					} else {
						res.send(self._parseSend(model));
					}
				});
			}
		});
	},

	put: function(req, res, next) {
		var self = this;
		
		this._requireModel(req.params.url, function(err, Model) {
			if (err) {
				res.send({ error: err });
			} else {
				if (req.body._id) delete req.body._id;
				
				Model.update({ _id: req.params.id }, req.body, {}, function(err, na) {
					if (err) { 
						res.send({ error: err });
					} else {
						Model.findOne({ _id: req.params.id }, function(err, model) {
							res.send(self._parseSend(model));
						});
					}
				});
			}
		});
	},

	delete: function(req, res, next) {
		var self = this;
		
		this._requireModel(req.params.url, function(err, Model) {
			if (err) {
				res.send({ error: err });
			} else {
				Model.findOne({ _id: req.params.id }, function(err, model) {
					if (err) { 
						res.send({ error: err });
					} else {
						model.remove();
						res.send(self._parseSend(model));
					}
				});
			}
		});
	}
}

module.exports = Controller;
