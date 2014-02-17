EmberFlare.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo("entries");
  }
});
