var _ = require('underscore'),
	Controller = require('../../../lib/controller');

var UserController = function() {
	this._ctor.apply(this, arguments);
};

UserController.prototype = _.extend(Controller.prototype, {

});

module.exports = UserController;
