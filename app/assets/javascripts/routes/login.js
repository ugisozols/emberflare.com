EmberFlare.LoginRoute = Ember.Route.extend({
  deactivate: function() {
    this.controllerFor("login").set("loginFailed", false);
  }
});
