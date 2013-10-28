EmberFlare.LoginRoute = Ember.Route.extend({
  actions: {
    login: function() {
      var loginController = this.controllerFor('login'),
          username = loginController.get("username"),
          password = loginController.get('password'),
          self = this;

      if (!Ember.isEmpty(username) && !Ember.isEmpty(password)) {
        var postData = { session: { username: username, password: password } };

        $.post("/api/session", postData).then(function(response) {
          $.cookie("auth_token", response.token)

          var applicationController = self.controllerFor("application");
          var transition = applicationController.get('savedTransition');

          applicationController.set("userName", username);
          applicationController.login();

          if (transition) {
            transition.retry();
          } else {
            self.transitionTo('entries');
          }
        }, function(response) {
          // failure
        });
      }
    }
  }
});
