class FeedController < ApplicationController
  respond_to :rss

  def index
    @entries = Entry.all

    respond_with @entries
  end
end
