EmberFlare.AccountRoute = Ember.Route.extend(SimpleAuth.AuthenticatedRouteMixin, {
  model: function() {
    return this.store.find("account", "current_user");
  },

  deactivate: function() {
    this.controller.setProperties({"saveSucceeded": false, "saveFailed": false});
  },

  actions: {
    updateTitle: function(tokens) {
      tokens.push("Account");
      return true;
    }
  }
});
