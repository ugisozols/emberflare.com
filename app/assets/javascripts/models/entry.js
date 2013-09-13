EmberFlare.Entry = DS.Model.extend({
  title: DS.attr("string"),
  content: DS.attr("string")
});

EmberFlare.Entry.FIXTURES = [
  { id: 1, title: "first", content: "This is content for the 1st entry" },
  { id: 2, title: "second", content: "This is content for the 2nd entry" }
]
