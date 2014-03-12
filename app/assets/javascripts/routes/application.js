EmberFlare.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  actions: {
    sessionAuthenticationFailed: function() {
      this.controllerFor("signin").set("signinFailed", true);
    }
  }
});
