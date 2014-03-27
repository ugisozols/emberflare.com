EmberFlare.AccountSerializer = DS.ActiveModelSerializer.extend({
  serialize: function(record, options) {
    var json = this._super(record, options);

    json.old_password = record.get("oldPassword");
    json.new_password = record.get("newPassword");

    return json;
  }
});
