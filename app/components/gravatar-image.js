import Ember from "ember";

export default Ember.Component.extend({
  classNames: ["gravatar"],

  size: 40,
  emailHash: "",

  gravatarUrl: function() {
    var size = this.get("size"),
        emailHash = this.get("emailHash");

    return "https://secure.gravatar.com/avatar/" + emailHash + "?s=" + size;
  }.property("size", "emailHash")
});
