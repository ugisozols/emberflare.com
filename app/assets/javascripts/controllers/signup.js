EmberFlare.SignupController = Ember.ObjectController.extend({
  signupFailed: false,
  password: "",

  fieldsEmpty: function() {
    return Ember.isEmpty(this.get("username")) ||
           Ember.isEmpty(this.get("email")) ||
           Ember.isEmpty(this.get("password"));
  }.property("username", "email", "password"),

  actions: {
    signup: function() {
      var self = this;
      var data = this.getProperties("username", "email", "password");

      return Ember.$.ajax({
        url: "/api/users",
        type: "POST",
        data: { user: data },
        dataType: "json",
      }).then(function() {
        self.transitionToRoute("signin");
      }, function() {
        self.set("signupFailed", true);
      });
    },

    clearWarning: function() {
      this.set("signupFailed", false);
    }
  }
});
