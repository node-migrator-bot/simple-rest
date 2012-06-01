define(["app", "models/user/model"], function(App, model) {
	return Backbone.Collection.extend({	
		model: model,
		url: function() {
			return App.getRestUrl()+'/user';
		}
	});
});

