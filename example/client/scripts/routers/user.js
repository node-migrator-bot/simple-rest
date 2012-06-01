define([], function() {
	return Backbone.Router.extend({
		routes: {
			"": "list"
		},

		list: function() {
			require(["views/user/list", "models/user/collection"], function(ListView, UserCollection) {
				var users = new UserCollection();
				
				users.fetch({ success: function(users) {
					var list = new ListView({
						collection: users
					});
					
					list.render();
				}});
			});
		}
	});
});

