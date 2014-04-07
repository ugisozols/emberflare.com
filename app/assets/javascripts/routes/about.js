EmberFlare.AboutRoute = Ember.Route.extend({
  actions: {
    updateTitle: function(tokens) {
      tokens.push("About");
      return true;
    }
  }
});
