Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(application, {
      authenticationRoute: "signin",
      routeAfterAuthentication: "entries.index",
      routeAfterInvalidation: "entries.index"
    });
  }
});
