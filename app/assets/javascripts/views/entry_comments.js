EmberFlare.EntryCommentsView = Ember.View.extend({
  elementId: 'disqus_thread',
  tagName: 'div',

  didInsertElement: function () {
    var id = this.get('entry.id'),
        title = this.get('entry.title');

    if (window.DISQUS) {
      DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = id;
          this.page.title = title;
          this.page.url = window.location.toString();
        }
      });
    } else {
      window.disqus_shortname = 'emberflare';
      window.disqus_identifier = id;
      window.disqus_url = window.location.toString();
      window.disqus_title = title;
      var dsq = document.createElement('script');
      dsq.type = 'text/javascript';
      dsq.async = true;
      dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    }
  }
});
