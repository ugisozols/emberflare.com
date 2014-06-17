EmberFlare.AccountRoute = Ember.Route.extend(SimpleAuth.AuthenticatedRouteMixin,
  model: ->
    @store.find "account", "current_user"

  deactivate: ->
    @controller.setProperties
      saveSucceeded: false
      saveFailed: false

  actions:
    updateTitle: (tokens) ->
      tokens.push "Account"
      true
)
