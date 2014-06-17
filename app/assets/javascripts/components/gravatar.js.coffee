EmberFlare.GravatarImageComponent = Ember.Component.extend
  classNames: ["gravatar"]
  size: 40
  emailHash: ""

  gravatarUrl: (->
    size = @get("size")
    emailHash = @get("emailHash")

    "https://secure.gravatar.com/avatar/#{emailHash}?s=#{size}"
  ).property("size", "emailHash")
