EmberFlare.EntryCommentsView = Ember.View.extend
  elementId: "disqus_thread"
  tagName: "div"

  didInsertElement: ->
    id = @get("entry.id")
    title = @get("entry.title")

    if window.DISQUS
      DISQUS.reset
        reload: true
        config: ->
          @page.identifier = id
          @page.title = title
          @page.url = window.location.toString()
    else
      window.disqus_shortname = "emberflare"
      window.disqus_identifier = id
      window.disqus_url = window.location.toString()
      window.disqus_title = title
      dsq = document.createElement("script")
      dsq.type = "text/javascript"
      dsq.async = true
      dsq.src = "//#{disqus_shortname}.disqus.com/embed.js"
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq)

