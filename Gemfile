source 'https://rubygems.org'

gem 'rails', '4.1.0.rc1'
gem 'bcrypt', '~> 3.1.2'
gem 'sqlite3'
gem "active_model_serializers"

gem 'sass-rails', '~> 4.0.0'
gem 'uglifier', '>= 1.3.0'
gem "bootstrap-sass", "~> 2.3.2.2"
gem "font-awesome-rails", "~> 4.0.3"
gem 'jquery-rails'

gem 'ember-rails'

gem "thin"

group :development do
  gem "quiet_assets"
  gem "pry-rails"
end

group :development, :test do
  gem 'rspec-rails', '~> 2.14.1'
  gem "factory_girl_rails", "~> 4.4.1"
end

group :test do
  gem "capybara", "~> 2.2.1"
  gem "poltergeist", "~> 1.5.0"
  gem "database_cleaner", "~> 1.2.0"
end

group :production do
  gem "bugsnag"
  gem "le"
end

ruby "2.1.1"
