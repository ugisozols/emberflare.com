EmberFlare.ApplicationRoute = Ember.Route.extend(SimpleAuth.ApplicationRouteMixin, {
  actions: {
    sessionAuthenticationFailed: function() {
      this.controllerFor("signin").set("signinFailed", true);
    },

    updateTitle: function(tokens) {
      if (tokens.length) {
        document.title = tokens.join(' - ') + " - EmberFlare";
      } else {
        document.title = "EmberFlare - Community driven place for all things Ember.js";
      }
    }
  }
});
