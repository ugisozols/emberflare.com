EmberFlare.EntriesRoute = Ember.Route.extend({
  model: function() {
    return this.store.find("entry");
  }
});
