class RssController < ApplicationController
  respond_to :rss

  def index
    @entries = Entry.order("id DESC")

    respond_with @entries
  end
end
