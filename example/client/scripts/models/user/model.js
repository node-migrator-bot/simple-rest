define(["app"], function(App) {
	return Backbone.Model.extend({
		url: function() {
			if (this.id) {
				return App.getRestUrl()+'/user/' + this.id;
			} else {
				return App.getRestUrl()+'/user';
			}
		}
	});
});
