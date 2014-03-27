EmberFlare.EntriesShowRoute = Ember.Route.extend({
  model: function(params) {
    var self = this;

    return this.store.find("entry", params.slug).then(
      null,
      function() {
        return self.transitionTo("error404");
      }
    );
  }
});
