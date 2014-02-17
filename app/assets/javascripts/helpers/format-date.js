Ember.Handlebars.helper("format-date", function(input) {
  return new Handlebars.SafeString(moment(input).format("MMM Do, YYYY"));
});
