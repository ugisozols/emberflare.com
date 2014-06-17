showdown = new Showdown.converter()

Ember.Handlebars.helper "format-markdown", (input) ->
  new Handlebars.SafeString(showdown.makeHtml(input))
