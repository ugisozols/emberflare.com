EmberFlare.Account = DS.Model.extend(Ember.Validations.Mixin, {
  email: DS.attr("string"),
  gravatarEmailHash: DS.attr("string"),

  validations: {
    email: {
      presence: true
    },
    newPassword: {
      length: {
        minimum: 6,
        maximum: 50,
        allowBlank: true
      }
    }
  }
});
