import Ember from "ember";

export default Ember.Component.extend({
  tagName: "a",
  classNames: "twitter-share-button",
  attributeBindings: ["data-text", "data-via", "data-hashtags"],

  "data-text": function() {
    return this.get("title") + " -";
  }.property("title"),
  "data-hashtags": "emberjs",
  "data-via": "emberflare_com",

  title: "",

  didInsertElement: function() {
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
  },

  willDestroyElement: function() {
    Ember.$(".twitter-share-button, #twitter-wjs").remove();
  }
});
