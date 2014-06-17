EmberFlare.MissingRoute = Ember.Route.extend
  redirect: ->
    @transitionTo "error404"
