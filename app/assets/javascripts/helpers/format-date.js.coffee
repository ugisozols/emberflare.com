Ember.Handlebars.helper "format-date", (input) ->
  new Handlebars.SafeString(moment(input).format("MMM Do, YYYY"))
