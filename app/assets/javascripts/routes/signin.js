EmberFlare.SigninRoute = Ember.Route.extend(SimpleAuth.UnauthenticatedRouteMixin, {
  deactivate: function() {
    this.controller.set("signinFailed", false);
  },

  actions: {
    updateTitle: function(tokens) {
      tokens.push("Sign in");
      return true;
    }
  }
});
