EmberFlare.SignupRoute = Ember.Route.extend
  beforeModel: ->
    if @get("session.isAuthenticated")
      @transitionTo "entries"

  model: ->
    @store.createRecord "user"

  deactivate: ->
    model = @controller.get("model")
    model.rollback()
    model.deleteRecord() if model.get("isNew")

    @controller.set "signupFailed", false

  actions:
    updateTitle: (tokens) ->
      tokens.push "Sign up"
      true
