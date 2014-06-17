EmberFlare.ApplicationRoute = Ember.Route.extend(SimpleAuth.ApplicationRouteMixin,
  actions:
    updateTitle: (tokens) ->
      if tokens.length
        document.title = tokens.join(' - ') + " - EmberFlare"
      else
        document.title = "EmberFlare - Community driven place for all things Ember.js"
)
