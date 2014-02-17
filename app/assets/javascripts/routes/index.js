EmberFlare.IndexRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
  beforeModel: function() {
    this.transitionTo("entries");
  }
});
