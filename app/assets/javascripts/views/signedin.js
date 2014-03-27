EmberFlare.SignedinView = Ember.View.extend({
  classNames: ["user-details"],

  didInsertElement: function() {
    Ember.$("#signout, #account").tooltip({
      placement: 'bottom'
    });
  },

  willDestroyElement: function() {
    Ember.$("#signout, #account").tooltip('destroy');
  }
});
