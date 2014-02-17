Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(application, {
      routeAfterAuthentication: "entries.index",
      routeAfterInvalidation: "entries.index"
    });
  }
});
