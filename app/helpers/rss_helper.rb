module RssHelper
  def markdown_to_regular_url(text)
    text.gsub /\[([^\]]+)\]\(([^)]+)\)/, '<a href="\2">\1</a>'
  end
end
