import Ember from "ember";

export default Ember.Route.extend({
  model: function(params) {
    var self = this;

    return this.store.find("entry", params.entry_id).then(
      null,
      function() {
        return self.transitionTo("error404");
      }
    );
  }
});
