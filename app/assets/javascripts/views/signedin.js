EmberFlare.SignedinView = Ember.View.extend({
  classNames: ["user-details"],

  didInsertElement: function() {
    Ember.$("#signout, #account").tipsy();
  },

  willDestroyElement: function() {
    Ember.$(".tipsy").remove();
  }
});
