EmberFlare.ApplicationRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo("entries");
  },

  beforeModel: function() {
    if($.cookie("auth_token")) {
      var applicationController = this.controllerFor("application");
      applicationController.set("userName", "testY");
      applicationController.login();
    }
  }
});
