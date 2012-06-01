define([], function() {
	var App = {
		rest_url: config.rest_url,
		getRestUrl: function() {
			return this.rest_url;
		},
		getUrl: function() {
			return window.location.pathname;
		},
		navigate: function(url) {
			this.Router.navigate(url, { trigger: true, replace: true });
		}
	};

	return App;
});
