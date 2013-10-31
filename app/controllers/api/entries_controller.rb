class Api::EntriesController < ApplicationController
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
    _params = params.require(:entry).permit(:title, :content, :author)

    if current_user
      _params.merge! :user_id => current_user.id
    end

    _params
  end
end
