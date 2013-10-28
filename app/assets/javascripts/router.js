EmberFlare.Router.map(function() {
  this.resource("login");
  this.resource("logout");

  this.resource('entries', function() {
    this.route("new");
  });
});
