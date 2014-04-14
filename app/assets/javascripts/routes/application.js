EmberFlare.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  actions: {
    updateTitle: function(tokens) {
      if (tokens.length) {
        document.title = tokens.join(' - ') + " - EmberFlare";
      } else {
        document.title = "EmberFlare - Community driven place for all things Ember.js";
      }
    }
  }
});
