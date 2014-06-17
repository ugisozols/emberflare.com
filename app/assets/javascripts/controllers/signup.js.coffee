EmberFlare.SignupController = Ember.ObjectController.extend
  signupFailed: false
  password: ""

  fieldsEmpty: (->
    Ember.isEmpty(@get("username")) or Ember.isEmpty(@get("email")) or Ember.isEmpty(@get("password"))
  ).property("username", "email", "password")

  actions:
    signup: ->
      model = @get("model")

      model.set "password", @get("password")

      model.save().then (=>
        @transitionToRoute "signin"
      ), =>
        @set "signupFailed", true

    clearWarning: ->
      @set "signupFailed", false
