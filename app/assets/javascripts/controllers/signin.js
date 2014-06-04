EmberFlare.SigninController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  authenticatorFactory: "ember-simple-auth-authenticator:oauth2-password-grant",

  signinFailed: false,

  actions: {
    clearWarning: function() {
      this.set("signinFailed", false);
    }
  }
});
