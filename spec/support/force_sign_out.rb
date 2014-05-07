RSpec.configure do |config|
  config.before(:each, :js => true) do
    visit "/"

    unless page.has_css?("a[href='/signin']")
      find("a#signout").click
    end
  end
end
