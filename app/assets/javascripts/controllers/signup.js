EmberFlare.SignupController = Ember.ObjectController.extend({
  signupFailed: false,

  fieldsEmpty: function() {
    return Ember.isEmpty(this.get("username")) ||
           Ember.isEmpty(this.get("email")) ||
           Ember.isEmpty(this.get("password"));
  }.property("username", "email", "password"),

  actions: {
    signup: function() {
      var self = this;
      var model = this.get("model");

      model.save().then(function() {
        self.transitionToRoute("signin");
      }, function(response) {
        self.set("signupFailed", true);
      });
    },

    clearWarning: function() {
      this.set("signupFailed", false);
    }
  }
});
