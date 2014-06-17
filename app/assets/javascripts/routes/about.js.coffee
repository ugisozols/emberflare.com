EmberFlare.AboutRoute = Ember.Route.extend
  actions:
    updateTitle: (tokens) ->
      tokens.push "About"
      true
