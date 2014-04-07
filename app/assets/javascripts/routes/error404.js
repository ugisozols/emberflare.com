EmberFlare.Error404Route = Ember.Route.extend({
  actions: {
    updateTitle: function(tokens) {
      tokens.push("404");
      return true;
    }
  }
});
