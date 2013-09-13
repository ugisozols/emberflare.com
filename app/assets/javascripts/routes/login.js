EmberFlare.LoginRoute = Ember.Route.extend({
  actions: {
    login: function() {
      var loginController = this.controllerFor('login'),
          username = loginController.get('username'),
          password = loginController.get('password');

      // this would normally be done asynchronously
      if (username === 'abc' && password === '123') {
        localStorage.authToken = "auth-token-here";

        var applicationController = this.controllerFor('application');
        var transition = applicationController.get('savedTransition');

        // set isLoggedIn so the UI shows the logout button
        applicationController.login();

        // if the user was going somewhere, send them along, otherwise
        // default to `/posts`
        if (transition) {
          transition.retry();
        } else {
          this.transitionTo('entries');
        }
      }
    }
  }
});
