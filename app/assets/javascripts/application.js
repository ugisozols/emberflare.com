//= require jquery
//= require jquery_ujs
//= require handlebars
//= require ember
//= require ember-data
//= require ember-simple-auth
//= require showdown.min
//= require md5
//= require jquery.tipsy
//= require_self
//= require ember_flare

EmberFlare = Ember.Application.create({
  LOG_TRANSITIONS: true
});

$(document).ready(function() {
  $("#signout, #account").tipsy();
});
