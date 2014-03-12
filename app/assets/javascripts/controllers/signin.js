EmberFlare.SigninController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  signinFailed: false,

  actions: {
    clearWarning: function() {
      this.set("signinFailed", false);
    }
  }
});
