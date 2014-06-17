EmberFlare.IndexRoute = Ember.Route.extend
  beforeModel: ->
    @replaceWith "entries"
