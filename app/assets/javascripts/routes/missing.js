EmberFlare.MissingRoute = Ember.Route.extend({
  redirect: function() {
    return this.transitionTo("error404");
  }
});
