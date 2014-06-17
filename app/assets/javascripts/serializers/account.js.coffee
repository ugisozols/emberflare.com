EmberFlare.AccountSerializer = DS.ActiveModelSerializer.extend
  serialize: (record, options) ->
    json = @_super(record, options)

    json.old_password = record.get("oldPassword")
    json.new_password = record.get("newPassword")

    json
