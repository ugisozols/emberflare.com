import DS from "ember-data";

var attr = DS.attr();

var Entry = DS.Model.extend({
  title: attr,
  body: attr,
  authorName: attr,
  authorGravatarEmailHash: attr,
  createdAt: DS.attr("date")
});

Entry.reopenClass({
  FIXTURES: [
    {
        id: 1,
        title: "Test title",
        body: "Some text bla bla bla",
        authorGravatarEmailHash: "ugis.ozolss@gmail.com",
        createdAt: new Date()
    }
  ]
});

export default Entry;
