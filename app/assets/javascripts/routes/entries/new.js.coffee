EmberFlare.EntriesNewRoute = Ember.Route.extend
  model: ->
    @store.createRecord("entry")

  deactivate: ->
    model = @controller.get("model")
    model.rollback()
    model.deleteRecord() if model.get("isNew")

  actions:
    updateTitle: (tokens) ->
      tokens.push "Submit entry"
      true
