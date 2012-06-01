require(["app", "routers/misc", "routers/user"], function(App, MiscRouter, UserRouter) {

	new UserRouter();

	App.Router = new MiscRouter();

	Backbone.history.start({ 		
		root: App.getUrl(),
		pushState: true
	});
});
