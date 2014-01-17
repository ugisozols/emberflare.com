EmberFlare.Router.map(function() {
  this.route('login');

  this.resource('entries', function() {
    this.route("new");
  });
});

EmberFlare.Router.reopen({
  location: "history"
});
