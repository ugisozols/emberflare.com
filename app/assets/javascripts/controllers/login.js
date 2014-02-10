EmberFlare.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  loginFailed: false,

  actions: {
    sessionAuthenticationFailed: function() {
      this.set("loginFailed", true);
    }
  }
});
