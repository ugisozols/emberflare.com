EmberFlare.SignedinView = Ember.View.extend({
  classNames: ["user-details"],

  didInsertElement: function() {
    Ember.$("#signout, #account, #account-xs").tooltip({
      placement: 'bottom'
    });
  },

  willDestroyElement: function() {
    Ember.$("#signout, #account, #account-xs").tooltip('destroy');
  }
});
