# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
EmberFlare::Application.initialize!

if Rails.env.production?
  Rails.logger = Le.new(ENV["LOGENTRIES_API_KEY"])
end
