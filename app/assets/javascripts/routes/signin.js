EmberFlare.SigninRoute = Ember.Route.extend({
  deactivate: function() {
    this.controllerFor("signin").set("signinFailed", false);
  }
});
