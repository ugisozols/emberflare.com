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
    var model = this.controller.get("model");
    model.rollback();
    if (model.get("isNew")) {
      model.deleteRecord();
    }

    this.controller.set("signupFailed", false);
  },

  actions: {
    updateTitle: function(tokens) {
      tokens.push("Sign up");
      return true;
    }
  }
});
