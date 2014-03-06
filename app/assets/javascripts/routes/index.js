EmberFlare.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.replaceWith("entries");
  }
});
