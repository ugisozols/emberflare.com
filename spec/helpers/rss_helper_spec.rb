require "spec_helper"

describe RssHelper do
  describe "markdown_to_regular_url" do
    it "converts markdown urls to regular html ones" do
      text = "some markdown with [url](www.example.com)"
      expected_output = %Q{some markdown with <a href="www.example.com">url</a>}

      expect(helper.markdown_to_regular_url(text)).to eq expected_output
    end
  end
end
