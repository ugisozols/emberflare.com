class SitemapController < ApplicationController
  def index
    @entries = Entry.all
  end
end
