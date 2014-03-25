EmberFlare.EntrySerializer = DS.ActiveModelSerializer.extend({
  normalize: function(type, hash, property) {
    hash.id = hash.slug;
    return this._super(type, hash, property);
  }
});
