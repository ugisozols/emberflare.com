EmberFlare.GravatarImageComponent = Ember.Component.extend({
  size: 32,
  email: "",

  gravatarUrl: function() {
    var size = this.get("size"),
        email = this.get("email");

    return "http://www.gravatar.com/avatar/" + md5(email) + "?s=" + size;
  }.property("size", "email")
});
