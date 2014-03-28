module FeedHelper
  def markdown_to_html(text)
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :autolink => true)
    markdown.render(text)
  end
end
