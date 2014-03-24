EmberFlare.EntriesShowRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find("entry", params.slug);
  }
});
