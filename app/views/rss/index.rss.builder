xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "EmberFlare"
    xml.description "Community driven place for all things Ember.js"
    xml.link root_url

    @entries.each do |entry|
      xml.item do
        xml.title entry.title
        xml.link "#{root_url}entries/#{entry.slug}"
        xml.description markdown_to_regular_url(entry.body)
        xml.pubDate entry.created_at
      end
    end
  end
end
