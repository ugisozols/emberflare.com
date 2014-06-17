EmberFlare.AccountController = Ember.ObjectController.extend
  oldPassword: ""
  newPassword: ""
  saveFailed: false
  saveSucceeded: false

  actions:
    updateAccount: ->
      session = @get("session")
      model = @get("model")

      model.setProperties
        oldPassword: @get("oldPassword")
        newPassword: @get("newPassword")

      model.validate().then (=>
        model.save().then =>
          session.set "gravatar_email_hash", model.get("gravatarEmailHash")
          @setProperties
            saveSucceeded: true
            saveFailed: false
      ), =>
        @setProperties
          saveFailed: true
          saveSucceeded: false
