class Api::EntriesController < ApplicationController
  # before_filter :auth_only!, :only => :create

  respond_to :json

  def index
    respond_with Entry.all
  end

  def create
    entry = Entry.new(entry_params)

    if entry.save
      render json: entry
    else
      render json: entry, status: 422
    end
  end

  private

  def entry_params
    params.require(:entry).permit(:title, :content, :author)
  end
end
