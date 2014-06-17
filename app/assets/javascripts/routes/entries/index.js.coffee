EmberFlare.EntriesIndexRoute = Ember.Route.extend
  model: ->
    @store.find("entry")
