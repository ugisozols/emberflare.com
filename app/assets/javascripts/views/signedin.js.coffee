EmberFlare.SignedinView = Ember.View.extend
  classNames: ["user-details"]

  didInsertElement: ->
    Ember.$("#signout, #account").tooltip placement: "bottom"

  willDestroyElement: ->
    Ember.$("#signout, #account").tooltip "destroy"
