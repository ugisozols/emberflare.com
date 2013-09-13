var showdown = new Showdown.converter();

Ember.Handlebars.helper("format-markdown", function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});
