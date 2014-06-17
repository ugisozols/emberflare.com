EmberFlare.Error404Route = Ember.Route.extend
  actions:
    updateTitle: (tokens) ->
      tokens.push "404"
      true
