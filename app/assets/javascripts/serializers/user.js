EmberFlare.UserSerializer = DS.RESTSerializer.extend({
  serialize: function(record, options) {
    var json = this._super(record, options);

    json.password = record.get("password");

    return json;
  }
});
