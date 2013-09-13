EmberFlare.ApplicationRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo("entries");
  }
});
