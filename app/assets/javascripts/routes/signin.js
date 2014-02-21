EmberFlare.SigninRoute = Ember.Route.extend({
  beforeModel: function() {
    if (this.get("session.isAuthenticated")) {
      this.transitionTo("entries");
    }
  },

  deactivate: function() {
    this.controllerFor("signin").set("signinFailed", false);
  }
});
