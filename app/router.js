import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("signin");
  this.route("signup");
  this.route("about");
  this.route("account");

  this.resource("entries", function() {
    this.route("show", { path: "/:entry_id" });
    this.route("new");
  });
});

export default Router;
