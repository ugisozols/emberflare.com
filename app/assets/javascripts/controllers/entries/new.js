EmberFlare.EntriesNewController = Ember.ObjectController.extend({
  isAdding: false,

  fieldsEmpty: function() {
    if (this.get("session").get("isAuthenticated")) {
      return Ember.isEmpty(this.get("model.title")) ||
        Ember.isEmpty(this.get("model.content"))
    } else {
      return Ember.isEmpty(this.get("model.title")) ||
        Ember.isEmpty(this.get("model.content")) ||
        Ember.isEmpty(this.get("model.author"))
    }

  }.property("model.title", "model.content", "model.author"),

  actions: {
    createEntry: function() {
      var self = this;
      var model = this.get("model");

      this.set("isAdding", true);

      model.save().then(function() {
        self.set("isAdding", false);
        self.transitionToRoute("entries.index");
      });
    }
  },
});
