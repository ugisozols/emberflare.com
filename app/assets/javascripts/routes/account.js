EmberFlare.AccountRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
  model: function() {
    return this.store.find("account", "current_user");
  },

  deactivate: function() {
    this.controller.setProperties({"saveSucceeded": false, "saveFailed": false});
  },
});
