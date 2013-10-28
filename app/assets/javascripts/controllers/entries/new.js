EmberFlare.EntriesNewController = Ember.ObjectController.extend({
  fieldsEmpty: function() {
    if (this.get("session").get("isAuthenticated")) {
      return Ember.isEmpty(this.get("model.title")) ||
        Ember.isEmpty(this.get("model.content"))
    } else {
      return Ember.isEmpty(this.get("model.title")) ||
        Ember.isEmpty(this.get("model.content")) ||
        Ember.isEmpty(this.get("model.author"))
    }

  }.property("model.title", "model.content", "model.author")
});
