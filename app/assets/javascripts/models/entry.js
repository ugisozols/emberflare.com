EmberFlare.Entry = DS.Model.extend({
  slug: DS.attr("string"),
  title: DS.attr("string"),
  body: DS.attr("string"),
  authorName: DS.attr("string"),
  authorGravatarEmailHash: DS.attr("string"),
  createdAt: DS.attr("date")
});
