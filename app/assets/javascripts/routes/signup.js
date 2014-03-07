EmberFlare.SignupRoute = Ember.Route.extend({
  beforeModel: function() {
    if (this.get("session.isAuthenticated")) {
      this.transitionTo("entries");
    }
  },

  model: function() {
    return this.store.createRecord("user");
  },

  deactivate: function() {
    var model = this.controllerFor("signup").get("model");
    model.rollback();
    if (model.get("isNew")) {
      model.deleteRecord();
    }

    this.controllerFor("signup").set("signupFailed", false);
  },
});
