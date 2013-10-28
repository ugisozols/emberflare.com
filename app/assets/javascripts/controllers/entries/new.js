EmberFlare.EntriesNewController = Ember.ObjectController.extend({
  fieldsEmpty: function() {
    return Ember.isEmpty(this.get("model.title")) || Ember.isEmpty(this.get("model.content"))
  }.property("model.title", "model.content")
});
