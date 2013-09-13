EmberFlare.NewController = Ember.ArrayController.extend({
  actions: {
    createEntry: function() {
      var title = this.get("newTitle");

      // no idea what this does :)
      if (!title.trim()) { return; }

      var entry = this.store.createRecord('entry', {
        title: title,
        content: this.get("newContent")
      });

      this.set("newTitle", "");
      this.set("newContent", "");

      entry.save();

      this.transitionToRoute("entries");
    }
  }
});
