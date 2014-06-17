EmberFlare.EntriesNewController = Ember.ObjectController.extend
  isAdding: false

  fieldsEmpty: (->
    if @get("session.isAuthenticated")
      Ember.isEmpty(@get("title")) or Ember.isEmpty(@get("body"))
    else
      Ember.isEmpty(@get("title")) or Ember.isEmpty(@get("body")) or Ember.isEmpty(@get("authorName"))
  ).property("title", "body", "authorName")

  actions:
    createEntry: ->
      model = @get("model")

      @set "isAdding", true

      model.save().then =>
        @set "isAdding", false
        @transitionToRoute "entries.index"
