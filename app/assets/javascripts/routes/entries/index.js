EmberFlare.EntriesIndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find("entry");
  },

  actions: {
    updateTitle: function(tokens) {
      tokens.push("All entries");
      return true;
    }
  }
});
