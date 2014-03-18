EmberFlare.GravatarImageComponent = Ember.Component.extend({
  classNames: ["gravatar"],

  size: 40,
  emailHash: "",

  gravatarUrl: function() {
    var size = this.get("size"),
        emailHash = this.get("emailHash");

    return "http://www.gravatar.com/avatar/" + emailHash + "?s=" + size;
  }.property("size", "emailHash")
});
