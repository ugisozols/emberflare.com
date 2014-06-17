EmberFlare.EntriesShowRoute = Ember.Route.extend
  model: (params) ->
    @store.find("entry", params.entry_id).then null, =>
      @transitionTo "error404"

  actions:
    updateTitle: ((tokens) ->
      title = @get("currentModel.title")
      tokens.push title
      true
    ).observes("currentModel.title")
