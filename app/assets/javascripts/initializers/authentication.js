Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application, {
      authorizerFactory: "ember-simple-auth-authorizer:oauth2-bearer",
      authenticationRoute: "signin",
      routeAfterAuthentication: "entries.index",
      routeAfterInvalidation: "entries.index",
      store: Ember.SimpleAuth.Stores.Cookie
    });
  }
});
