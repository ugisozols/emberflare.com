EmberFlare.Router.map ->
  @route "signin"
  @route "signup"
  @route "about"
  @resource "account"

  @resource "entries", ->
    @route "show",
      path: "/:entry_id"
    @route "new"

  @route "error404"
  @route "missing",
    path: "/*path"

EmberFlare.Router.reopen
  location: "history",

  notifyGoogleAnalytics: (->
    ga "send", "pageview",
      page: @get("url")
      title: @get("url")
  ).on("didTransition")

  updateTitle: (->
    @send "updateTitle", []
  ).on("didTransition")
