Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application, {
      authenticationRoute: "signin",
      routeAfterAuthentication: "entries.index",
      routeAfterInvalidation: "entries.index",
      store: Ember.SimpleAuth.Stores.Cookie
    });
  }
});
