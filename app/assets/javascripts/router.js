EmberFlare.Router.map(function() {
  this.route('signin');
  this.resource("account");

  this.resource('entries', function() {
    this.route("new");
  });
});

EmberFlare.Router.reopen({
  location: "history"
});
