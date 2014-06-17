EmberFlare.UserSerializer = DS.ActiveModelSerializer.extend
  serialize: (record, options) ->
    json = @_super(record, options)

    json.password = record.get("password")

    json
