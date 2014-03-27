EmberFlare.AccountAdapter = EmberFlare.ApplicationAdapter.extend({
  pathForType: function(type) {
    var decamelized = Ember.String.decamelize(type);
    var underscored = Ember.String.underscore(decamelized);
    return underscored;
  }
});
