EmberFlare.EntriesNewController = Ember.ObjectController.extend({
  isAdding: false,

  fieldsEmpty: function() {
    if (this.get("session").get("isAuthenticated")) {
      return Ember.isEmpty(this.get("title")) ||
        Ember.isEmpty(this.get("content"))
    } else {
      return Ember.isEmpty(this.get("title")) ||
        Ember.isEmpty(this.get("content")) ||
        Ember.isEmpty(this.get("authorName"))
    }

  }.property("title", "content", "authorName"),

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
