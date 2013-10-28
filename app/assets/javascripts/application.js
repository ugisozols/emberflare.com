//= require jquery
//= require jquery_ujs
//= require handlebars
//= require ember
//= require ember-data
//= require ember-simple-auth
//= require showdown.min
//= require_self
//= require ember_flare

EmberFlare = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true
});

EmberFlare.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

// EmberFlare.Router.reopen({
//   location: "history"
// });

//= require_tree .
