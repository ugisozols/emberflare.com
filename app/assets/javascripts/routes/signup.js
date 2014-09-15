EmberFlare.SignupRoute = Ember.Route.extend(SimpleAuth.UnauthenticatedRouteMixin, {
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
