EmberFlare.Router.map(function() {
  this.resource("authenticated", { path: "/" }, function() {
    this.resource('new');
  });
  this.resource("login");

  this.resource('entries');
});
