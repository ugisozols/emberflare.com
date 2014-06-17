EmberFlare.TwitterShareButtonComponent = Ember.Component.extend
  tagName: "a",
  classNames: "twitter-share-button"
  attributeBindings: ["data-text", "data-via", "data-hashtags"]

  "data-text": (->
    @get("title") + " -"
  ).property("title")
  "data-hashtags": "emberjs"
  "data-via": "emberflare_com"

  title: ""

  didInsertElement: ->
    not ((d, s, id) ->
      js = undefined
      fjs = d.getElementsByTagName(s)[0]
      unless d.getElementById(id)
        js = d.createElement(s)
        js.id = id
        js.src = "//platform.twitter.com/widgets.js"
        fjs.parentNode.insertBefore js, fjs
    ) document, "script", "twitter-wjs"

  willDestroyElement: ->
    Ember.$(".twitter-share-button, #twitter-wjs").remove()
