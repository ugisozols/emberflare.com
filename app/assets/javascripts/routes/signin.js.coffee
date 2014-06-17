EmberFlare.SigninRoute = Ember.Route.extend
  beforeModel: ->
    if @get("session.isAuthenticated")
      @transitionTo "entries"

  deactivate: ->
    @controller.set "signinFailed", false

  actions:
    sessionAuthenticationFailed: ->
      @controller.set "signinFailed", true

    updateTitle: (tokens) ->
      tokens.push "Sign in"
      true
