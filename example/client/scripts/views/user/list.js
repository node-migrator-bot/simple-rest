define(["views/user/list/item"], function(ItemView) {
	return Backbone.View.extend({
		template: $('#templates-user-list').html(),
		className: 'users',
		
		events: {
			"submit form": "submit",
			"click .update": "update",
			"click .delete": "delete"
		},

		initialize: function() {
			this.on('change:collection', function(collection) {
				this.render();
			}, this);
		},
		
		submit: function(event) {
			var self = this;
			
			require(["models/user/model"], function(User) {
				var values = self.$form.serializeObject();
				var user;
				
				if (values.id == '')	 {
					delete values.id;
					user = new User(values);
						user.save({}, {
							success: function(user) {
								self.collection.add([user]);
								self.trigger('change:collection');
							}
						});
				} else {
					user = self.collection.get(values.id);
					user.save(values);
					self.trigger('change:collection');
				}
			});

			event.preventDefault();
			return false;
		},

		update: function(event) {
			var elem = event.target;
			var id = $(elem).parent().attr('rel');

			var user = this.collection.get(id);

			this.$form.find('input[name="firstname"]').val(user.get('firstname'));
			this.$form.find('input[name="lastname"]').val(user.get('lastname'));
			this.$form.find('input[name="id"]').val(user.id);

			return false;
		},

		delete: function(event) {
			var elem = event.target;
			var id = $(elem).parent().attr('rel');

			var user = this.collection.get(id);

			this.collection.remove([user]);
			this.trigger('change:collection');

			user.destroy();

			return false;
		},
		
		render: function() {
			var self = this;

			this.$el.html(Mustache.render(this.template, {}));
			this.$list = this.$el.find('ul');
			this.$form = this.$el.find('form');
						
			if (this.collection) {
				self.collection.each(function(user) {;
					self.$list.append((new ItemView({ model: user })).render().$el);
				});
			}

			$('#root').html(this.$el);

			this.delegateEvents();
			
			return this;
		}
	});
});

