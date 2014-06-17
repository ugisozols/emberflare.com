EmberFlare.AccountAdapter = EmberFlare.ApplicationAdapter.extend
  pathForType: (type) ->
    decamelized = Ember.String.decamelize(type)
    underscored = Ember.String.underscore(decamelized)
    underscored
