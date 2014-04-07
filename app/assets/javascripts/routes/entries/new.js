EmberFlare.EntriesNewRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord("entry");
  },

  deactivate: function() {
    var model = this.controller.get("model");
    model.rollback();
    if (model.get("isNew")) {
      model.deleteRecord();
    }
  },

  actions: {
    updateTitle: function(tokens) {
      tokens.push("Submit entry");
      return true;
    }
  }
});
