require "spec_helper"

describe FeedHelper do
  describe "markdown_to_html" do
    it "converts markdown to html" do
      text = "**markdown** with [url](www.example.com)"
      expected_output = %Q{<p><strong>markdown</strong> with <a href="www.example.com">url</a></p>\n}

      expect(helper.markdown_to_html(text)).to eq expected_output
    end
  end
end
