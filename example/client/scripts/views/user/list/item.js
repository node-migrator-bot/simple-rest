define([], function() {
	return Backbone.View.extend({
		template: $('#templates-user-list-item').html(),
		
		render: function() {
			this.$el = $(Mustache.render(this.template, this.model.toJSON()));
			
			return this;
		}
	});
});	
