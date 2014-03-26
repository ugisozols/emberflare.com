xml.instruct!
xml.urlset "xmlns" => "http://www.sitemaps.org/schemas/sitemap/0.9" do
  xml.url do
    xml.loc "#{root_url}entries"
    xml.lastmod @entries.first.updated_at.to_date
  end

  %w(submit about signin singup).each do |static_page|
    xml.url do
      xml.loc "#{root_url}#{static_page}"
    end
  end

  @entries.each do |entry|
    xml.url do
      xml.loc "#{root_url}entries/#{entry.slug}"
      xml.lastmod entry.updated_at.to_date
    end
  end
end
