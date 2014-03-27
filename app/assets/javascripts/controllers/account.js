EmberFlare.AccountController = Ember.ObjectController.extend({
  oldPassword: "",
  newPassword: "",
  saveFailed: false,
  saveSucceeded: false,

  actions: {
    updateAccount: function() {
      var self = this;
      var session = this.get("session");
      var model = this.get("model");

      model.setProperties({ oldPassword: this.get("oldPassword"),
                            newPassword: this.get("newPassword") });

      model.validate().then(function() {
        model.save().then(function(data) {
          session.set("gravatar_email_hash", model.get("gravatarEmailHash"));
          self.setProperties({"saveSucceeded": true, "saveFailed": false});
        });
      }, function() {
        self.setProperties({"saveFailed": true, "saveSucceeded": false});
      });

    }
  }
});
